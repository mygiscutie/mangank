import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path');
    const params = url.searchParams.get('params');
    
    if (!path) {
      return new Response(
        JSON.stringify({ error: 'Missing path parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Construct MangaDx API URL
    const mangadxUrl = new URL(path, 'https://api.mangadx.org');
    
    // Add query parameters if provided
    if (params) {
      const parsedParams = JSON.parse(params);
      Object.entries(parsedParams).forEach(([key, value]: [string, any]) => {
        if (Array.isArray(value)) {
          value.forEach(v => mangadxUrl.searchParams.append(key, v.toString()));
        } else if (value !== undefined && value !== null) {
          mangadxUrl.searchParams.append(key, value.toString());
        }
      });
    }

    console.log(`Proxying request to: ${mangadxUrl.toString()}`);

    // Make request to MangaDx API
    const response = await fetch(mangadxUrl.toString(), {
      method: req.method,
      headers: {
        'User-Agent': 'MangaNK/1.0',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error(`MangaDx API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: `MangaDx API error: ${response.status} ${response.statusText}` 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    console.error('Error in mangadx-proxy:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})