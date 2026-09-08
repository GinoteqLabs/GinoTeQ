const EDGE_URL = 'https://xwsudqvsqckvigkcxlwl.supabase.co/functions/v1/ginoteq-site-subscribe';

const json = (res, status, body) => {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.end(JSON.stringify(body));
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  try {
    const upstream = await fetch(EDGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
    });

    const text = await upstream.text();
    res.status(upstream.status).setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(text || JSON.stringify({ ok: upstream.ok }));
  } catch (error) {
    console.error('Ginoteq subscription proxy failed', error);
    return json(res, 503, { ok: false, error: 'temporarily_unavailable' });
  }
}
