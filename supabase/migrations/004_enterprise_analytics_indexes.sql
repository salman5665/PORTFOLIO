-- Enterprise visitor intelligence extension.
-- Keeps the existing analytics_events table and adds query indexes only.

create index if not exists idx_analytics_visitor_id
  on analytics_events ((metadata->>'visitorId'));

create index if not exists idx_analytics_session_id
  on analytics_events ((metadata->'sessionAnalytics'->>'currentSessionId'));

create index if not exists idx_analytics_page_created
  on analytics_events (page, created_at desc);

create index if not exists idx_analytics_country
  on analytics_events ((metadata->>'country'));

create index if not exists idx_analytics_city
  on analytics_events ((metadata->>'city'));

create index if not exists idx_analytics_device_type
  on analytics_events ((metadata->'browserIntelligence'->>'deviceType'));

create index if not exists idx_analytics_referrer_source
  on analytics_events ((metadata->'navigationAnalytics'->'referrer'->>'source'));

create index if not exists idx_analytics_metadata_gin
  on analytics_events using gin (metadata);
