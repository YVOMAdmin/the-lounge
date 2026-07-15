@AGENTS.md

## Testing authenticated flows

Never enter or type a real password (admin or otherwise) into a login form to test authentication, even when the credential is available in `.env.local`. Always use one of these instead:

* A Supabase-generated magic link via the admin API (the same method `app/api/admin-enter-platform` uses)
* A disposable test account created and deleted via the Supabase admin API

This applies regardless of whose credential it is or where it came from.
