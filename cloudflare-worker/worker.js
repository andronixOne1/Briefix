/**
 * Briefix ↔ Jira Cloud Bridge (Cloudflare Worker)
 * Handles Atlassian OAuth 2.0 (3LO) per-user authentication,
 * Jira issue creation with ADF formatting, per-brand board routing,
 * and automatic .jsx / .txt attachment uploads.
 *
 * Required Cloudflare Worker Secrets / Variables:
 *   ATLASSIAN_CLIENT_ID      - From Atlassian Developer Console → Settings
 *   ATLASSIAN_CLIENT_SECRET  - From Atlassian Developer Console → Settings (encrypt as Secret)
 *
 * Optional Variables:
 *   ALLOWED_ORIGIN           - Defaults to "https://andronixone1.github.io"
 *   DEFAULT_PROJECT_KEY      - Fallback Jira Project Key if brand has none set
 */

const WORKER_CALLBACK_PATH = '/auth/callback';

function getCorsHeaders(request, env) {
    const origin = request.headers.get('Origin') || '';
    const configured = (env.ALLOWED_ORIGIN || 'https://andronixone1.github.io').toLowerCase();
    const isLocal = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    const allowOrigin = (origin.toLowerCase() === configured || isLocal)
        ? origin
        : (env.ALLOWED_ORIGIN || 'https://andronixOne1.github.io');

    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Vary': 'Origin'
    };
}

function jsonResponse(data, status, corsHeaders) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        }
    });
}

// Build clean Atlassian Document Format (ADF) description for Jira Cloud
function buildJiraAdfDescription(payload) {
    const content = [];

    const addHeading = (text, level = 3) => {
        content.push({
            type: 'heading',
            attrs: { level },
            content: [{ type: 'text', text: String(text) }]
        });
    };

    const addParagraph = (text) => {
        if (!text) return;
        content.push({
            type: 'paragraph',
            content: [{ type: 'text', text: String(text) }]
        });
    };

    const addBulletList = (items) => {
        if (!items || items.length === 0) return;
        content.push({
            type: 'bulletList',
            content: items.map(item => ({
                type: 'listItem',
                content: [{
                    type: 'paragraph',
                    content: [{ type: 'text', text: String(item) }]
                }]
            }))
        });
    };

    // Overview
    addHeading('Campaign Brief', 2);
    addParagraph(`Brand: ${payload.brandName || 'N/A'}  |  Market: ${payload.market || 'Global'}  |  Estimated Delivery: ${payload.estimatedTimeText || '0 days'}`);
    if (payload.description) {
        addParagraph(payload.description);
    }

    // Task Types & Estimated Time
    if (Array.isArray(payload.taskTypes) && payload.taskTypes.length > 0) {
        addHeading('Task Scope & Estimated Delivery', 3);
        const typeLines = payload.taskTypes.map(t =>
            `${t.amount}x ${t.name} (${t.days}d each = ${t.subtotalDays}d)`
        );
        typeLines.push(`Total Estimated Time to Complete: ${payload.estimatedTimeText || (payload.estimatedDays + ' days')}`);
        addBulletList(typeLines);
    }

    // File Dimensions
    if (Array.isArray(payload.formats) && payload.formats.length > 0) {
        addHeading(`Deliverable Formats (${payload.formats.length})`, 3);
        const fmtLines = payload.formats.map(f => {
            const notes = f.safeZoneNotes ? ` — ${f.safeZoneNotes}` : '';
            return `${f.formatName || f.name} (${f.width}x${f.height}px)${notes}`;
        });
        addBulletList(fmtLines);
    }

    // Language Copies
    if (Array.isArray(payload.languages) && payload.languages.length > 0) {
        addHeading(`Language Copies (${payload.languages.length})`, 3);
        const langLines = payload.languages.map(l => {
            const h = l.headline ? `Headline: "${l.headline}"` : 'Headline: (empty)';
            const s = l.subheading ? ` | Sub-heading: "${l.subheading}"` : '';
            return `[${l.name}] ${h}${s}`;
        });
        addBulletList(langLines);
    }

    addParagraph('--- Created via Briefix (Photoshop .jsx & Figma .txt scripts attached) ---');

    return {
        type: 'doc',
        version: 1,
        content
    };
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const corsHeaders = getCorsHeaders(request, env);

        // Handle CORS Preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // Health Check
        if (url.pathname === '/' || url.pathname === '/health') {
            return jsonResponse({
                service: 'Briefix Jira Bridge',
                status: 'ok',
                configured: Boolean(env.ATLASSIAN_CLIENT_ID && env.ATLASSIAN_CLIENT_SECRET)
            }, 200, corsHeaders);
        }

        // 1. OAuth Login Redirect
        if (url.pathname === '/auth/login' && request.method === 'GET') {
            if (!env.ATLASSIAN_CLIENT_ID) {
                return new Response('Missing ATLASSIAN_CLIENT_ID secret in Cloudflare Worker.', { status: 500 });
            }

            const returnTo = url.searchParams.get('return_to') || env.ALLOWED_ORIGIN || 'https://andronixOne1.github.io/Briefix/';
            const redirectUri = `${url.origin}${WORKER_CALLBACK_PATH}`;
            const state = btoa(unescape(encodeURIComponent(JSON.stringify({ returnTo }))));

            const baseScopes = 'read:jira-work write:jira-work read:jira-user offline_access';
            const scopes = env.EXTRA_SCOPES ? `${baseScopes} ${env.EXTRA_SCOPES}` : baseScopes;

            const authUrl = new URL('https://auth.atlassian.com/authorize');
            authUrl.searchParams.set('audience', 'api.atlassian.com');
            authUrl.searchParams.set('client_id', env.ATLASSIAN_CLIENT_ID);
            authUrl.searchParams.set('scope', scopes);
            authUrl.searchParams.set('redirect_uri', redirectUri);
            authUrl.searchParams.set('state', state);
            authUrl.searchParams.set('response_type', 'code');
            authUrl.searchParams.set('prompt', 'consent');

            return Response.redirect(authUrl.toString(), 302);
        }

        // 2. OAuth Callback
        if (url.pathname === WORKER_CALLBACK_PATH && request.method === 'GET') {
            const code = url.searchParams.get('code');
            const error = url.searchParams.get('error');
            const stateParam = url.searchParams.get('state') || '';

            let returnTo = env.ALLOWED_ORIGIN || 'https://andronixOne1.github.io/Briefix/';
            try {
                const decoded = JSON.parse(decodeURIComponent(escape(atob(stateParam))));
                if (decoded && decoded.returnTo) returnTo = decoded.returnTo;
            } catch (_) {}

            if (error || !code) {
                return new Response(`Jira Authorization failed: ${error || 'Missing authorization code'}`, { status: 400 });
            }

            const redirectUri = `${url.origin}${WORKER_CALLBACK_PATH}`;

            // Exchange code for tokens
            const tokenRes = await fetch('https://auth.atlassian.com/oauth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    grant_type: 'authorization_code',
                    client_id: env.ATLASSIAN_CLIENT_ID,
                    client_secret: env.ATLASSIAN_CLIENT_SECRET,
                    code,
                    redirect_uri: redirectUri
                })
            });

            const tokenData = await tokenRes.json();
            if (!tokenRes.ok || !tokenData.access_token) {
                return new Response(`Token exchange failed: ${JSON.stringify(tokenData)}`, { status: 400 });
            }

            // Get accessible Jira Cloud sites
            const sitesRes = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Accept': 'application/json'
                }
            });
            const sites = await sitesRes.json();
            if (!Array.isArray(sites) || sites.length === 0) {
                return new Response('No accessible Jira Cloud sites found for this account.', { status: 400 });
            }

            const site = sites[0]; // Primary Jira site

            // Get signed-in user profile
            let user = { displayName: 'Jira User', emailAddress: '', avatarUrl: '' };
            try {
                const meRes = await fetch(`https://api.atlassian.com/ex/jira/${site.id}/rest/api/3/myself`, {
                    headers: {
                        'Authorization': `Bearer ${tokenData.access_token}`,
                        'Accept': 'application/json'
                    }
                });
                if (meRes.ok) {
                    const me = await meRes.json();
                    user = {
                        accountId: me.accountId,
                        displayName: me.displayName || 'Jira User',
                        emailAddress: me.emailAddress || '',
                        avatarUrl: (me.avatarUrls && (me.avatarUrls['48x48'] || me.avatarUrls['32x32'])) || ''
                    };
                }
            } catch (_) {}

            const sessionPayload = {
                type: 'BRIEFIX_JIRA_AUTH',
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || null,
                expiresAt: Date.now() + ((tokenData.expires_in || 3600) - 60) * 1000,
                cloudId: site.id,
                siteName: site.name,
                siteUrl: site.url,
                sites: sites.map(s => ({ id: s.id, name: s.name, url: s.url })),
                user
            };

            const safePayloadJson = JSON.stringify(sessionPayload).replace(/</g, '\\u003c');
            const safeReturnTo = JSON.stringify(returnTo);

            // Return bridge HTML that notifies opener popup (or redirects if not a popup)
            const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Briefix — Jira Connected</title></head>
<body style="background:#05070c;color:#e2e8f0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
<div style="text-align:center;">
    <h2 style="color:#00f2fe;">Connected to Jira!</h2>
    <p style="font-size:13px;color:#94a3b8;">Signed in as ${user.displayName}. Returning to Briefix...</p>
</div>
<script>
    const payload = ${safePayloadJson};
    const returnTo = ${safeReturnTo};
    if (window.opener && !window.opener.closed) {
        window.opener.postMessage(payload, '*');
        setTimeout(() => window.close(), 400);
    } else {
        const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
        window.location.href = returnTo + '#jira_auth=' + encoded;
    }
</script>
</body>
</html>`;

            return new Response(html, {
                status: 200,
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // 3. Refresh OAuth Access Token
        if (url.pathname === '/auth/refresh' && request.method === 'POST') {
            try {
                const { refreshToken } = await request.json();
                if (!refreshToken) {
                    return jsonResponse({ error: 'Missing refreshToken' }, 400, corsHeaders);
                }

                const tokenRes = await fetch('https://auth.atlassian.com/oauth/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        grant_type: 'refresh_token',
                        client_id: env.ATLASSIAN_CLIENT_ID,
                        client_secret: env.ATLASSIAN_CLIENT_SECRET,
                        refresh_token: refreshToken
                    })
                });

                const tokenData = await tokenRes.json();
                if (!tokenRes.ok || !tokenData.access_token) {
                    return jsonResponse({ error: 'Refresh failed', details: tokenData }, 401, corsHeaders);
                }

                return jsonResponse({
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token || refreshToken,
                    expiresAt: Date.now() + ((tokenData.expires_in || 3600) - 60) * 1000
                }, 200, corsHeaders);
            } catch (err) {
                return jsonResponse({ error: err.message }, 500, corsHeaders);
            }
        }

        // 4. Create Jira Issue & Upload Attachments under the signed-in user's account
        if (url.pathname === '/jira/create-task' && request.method === 'POST') {
            try {
                const payload = await request.json();
                const {
                    accessToken,
                    cloudId,
                    siteUrl,
                    projectKey,
                    issueType,
                    boardLabel,
                    boardId,
                    summary,
                    attachments
                } = payload;

                const targetProjectKey = (projectKey || env.DEFAULT_PROJECT_KEY || '').trim();

                if (!accessToken || !cloudId) {
                    return jsonResponse({ error: 'Not authenticated with Jira. Please sign in first.' }, 401, corsHeaders);
                }
                if (!targetProjectKey) {
                    return jsonResponse({ error: 'Missing Jira Project Key for this brand.' }, 400, corsHeaders);
                }

                // Labels (sanitize spaces)
                const labels = ['Briefix'];
                if (payload.brandName) {
                    const cleanBrand = payload.brandName.trim().replace(/\s+/g, '-');
                    if (cleanBrand) labels.push(cleanBrand);
                }
                if (boardLabel) {
                    boardLabel.split(',').forEach(lbl => {
                        const clean = lbl.trim().replace(/\s+/g, '-');
                        if (clean && !labels.includes(clean)) labels.push(clean);
                    });
                }

                const issueBody = {
                    fields: {
                        project: { key: targetProjectKey },
                        summary: summary || `${payload.brandName || 'Briefix'} Campaign Task`,
                        issuetype: { name: (issueType || 'Task').trim() },
                        description: buildJiraAdfDescription(payload),
                        labels
                    }
                };

                // Create Issue as the signed-in user
                const createRes = await fetch(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(issueBody)
                });

                const createData = await createRes.json();
                if (!createRes.ok) {
                    return jsonResponse({
                        error: 'Jira rejected issue creation',
                        status: createRes.status,
                        details: createData
                    }, createRes.status, corsHeaders);
                }

                const issueKey = createData.key;
                const issueId = createData.id;

                // Optional: If Scrum boardId provided, try adding to active sprint
                let sprintAdded = false;
                if (boardId) {
                    try {
                        const sprintRes = await fetch(
                            `https://api.atlassian.com/ex/jira/${cloudId}/rest/agile/1.0/board/${encodeURIComponent(boardId)}/sprint?state=active`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                    'Accept': 'application/json'
                                }
                            }
                        );
                        if (sprintRes.ok) {
                            const sprintData = await sprintRes.json();
                            if (sprintData.values && sprintData.values.length > 0) {
                                const activeSprintId = sprintData.values[0].id;
                                const moveRes = await fetch(
                                    `https://api.atlassian.com/ex/jira/${cloudId}/rest/agile/1.0/sprint/${activeSprintId}/issue`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${accessToken}`,
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ issues: [issueKey] })
                                    }
                                );
                                if (moveRes.ok) sprintAdded = true;
                            }
                        }
                    } catch (_) {
                        // Gracefully ignore if board is Kanban or Agile scope isn't enabled
                    }
                }

                // Upload Attachments (.jsx and .txt)
                const uploadedFiles = [];
                const attachmentErrors = [];

                if (Array.isArray(attachments)) {
                    for (const att of attachments) {
                        if (!att || !att.filename || typeof att.content !== 'string') continue;
                        try {
                            const formData = new FormData();
                            formData.append(
                                'file',
                                new Blob([att.content], { type: 'text/plain;charset=utf-8' }),
                                att.filename
                            );

                            const attRes = await fetch(
                                `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${issueKey}/attachments`,
                                {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${accessToken}`,
                                        'X-Atlassian-Token': 'no-check',
                                        'Accept': 'application/json'
                                    },
                                    body: formData
                                }
                            );

                            if (attRes.ok) {
                                uploadedFiles.push(att.filename);
                            } else {
                                const errText = await attRes.text();
                                attachmentErrors.push({ filename: att.filename, error: errText });
                            }
                        } catch (attErr) {
                            attachmentErrors.push({ filename: att.filename, error: attErr.message });
                        }
                    }
                }

                const cleanSiteUrl = (siteUrl || '').replace(/\/$/, '');
                return jsonResponse({
                    success: true,
                    key: issueKey,
                    id: issueId,
                    url: cleanSiteUrl ? `${cleanSiteUrl}/browse/${issueKey}` : '',
                    attachmentsUploaded: uploadedFiles,
                    attachmentErrors,
                    sprintAdded
                }, 200, corsHeaders);

            } catch (err) {
                return jsonResponse({ error: err.message }, 500, corsHeaders);
            }
        }

        return jsonResponse({ error: 'Not Found' }, 404, corsHeaders);
    }
};
