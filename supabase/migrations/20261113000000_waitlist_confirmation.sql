-- Email confirmation for the waitlist: the signup counts as confirmed once the visitor
-- presses the button behind the emailed link.
alter table waitlist_signups add column confirmed_at timestamptz;
alter table waitlist_signups add column confirmation_sent_at timestamptz;
