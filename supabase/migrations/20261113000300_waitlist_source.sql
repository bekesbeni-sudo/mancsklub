-- Where a waitlist signup came from: the site's own form, or the earlier Google Forms survey
-- (imported without sending any email, so those people can get a separate first message).
alter table waitlist_signups add column source text not null default 'site'
  check (source in ('site', 'form'));
