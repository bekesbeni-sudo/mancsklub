-- When the first letter to the survey people went to this address. Set before sending and cleared
-- again if the send fails, so nobody gets the letter twice.
alter table waitlist_signups add column survey_email_sent_at timestamptz;
