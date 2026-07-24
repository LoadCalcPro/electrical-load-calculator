# LoadCalcPro Website Staging Plan

## Safety rule

The `main` branch and the current GitHub Pages production site must remain unchanged until staging has passed every test and the owner explicitly approves a production release.

## Staging architecture

- Production website: current `main` branch and current public URL — unchanged.
- Staging website source: this `staging` branch.
- Staging website URL: a separate deployment target, not the current production GitHub Pages URL.
- Production API: current Render service — unchanged.
- Staging API: a separate Render service connected only to the API repository's `staging` branch.
- Production Supabase: current project — unchanged.
- Staging Supabase: a separate Supabase project with test-only users and records.
- Payhip: production purchase links and webhooks remain unchanged. Staging must not send test events into production customer data.

## Migration sequence

1. Freeze production
   - Do not edit `main` while staging is being prepared.
   - Record the current production URLs, Render service name, Supabase project reference, and Payhip webhook destination.

2. Create isolated deployments
   - Deploy this branch to a separate staging site.
   - Deploy the API repository's `staging` branch as a new Render Web Service.
   - Create a new Supabase staging project.

3. Configure staging-only values
   - Point the staging website to the staging Render API URL.
   - Use only the staging Supabase public URL and anon key in browser code.
   - Keep the Supabase service-role key only in the staging Render environment.
   - Use a staging site URL for password creation and password-reset redirects.
   - Do not reuse production customer records.

4. Preserve current behavior first
   - Before redesigning or moving formulas, confirm that the copied staging system behaves exactly like production.
   - Fix staging configuration errors without changing production.

5. Improve one feature at a time
   - Login and session handling.
   - Create-password flow.
   - Forgot-password and reset-password flow.
   - Membership entitlement checks.
   - Calculator access controls.
   - Move proprietary calculations to the private API, one calculator at a time.

6. Release only after approval
   - Compare staging and production results.
   - Create a reviewed pull request from staging changes.
   - Do not merge or redirect production until the owner explicitly approves.

## Required website tests

### Public pages

- Home page loads normally.
- Store and Payhip links still point to production only on the live site.
- Contact, privacy, terms, and other public pages load correctly.

### Authentication

- New test member can create a password.
- Existing test member can sign in.
- Invalid credentials are rejected without exposing account details.
- Remember-email behavior is tested on Windows and iPhone.
- Sign-out clears the authenticated session.

### Password recovery

- Forgot-password email is received by a staging test account.
- Reset link opens the staging reset page, not production.
- User can set a new password and sign in.
- Expired or reused recovery links fail safely.

### Membership access

- Generator-only member sees only the generator calculator.
- AIC-only member sees only the AIC calculator.
- Suite member sees both calculators.
- Inactive or canceled test member is denied access.
- Directly entering a calculator URL does not bypass authorization.

### Calculator regression

For every calculator, save representative production input/output examples and verify that staging returns identical results, including blank inputs, minimum values, boundary values, large values, 208 V, 240 V, and HVAC/heat edge cases.

## Production protection checklist

- No commit is made to `main` during staging setup.
- No production environment variable is changed.
- No production Render service is reconnected to another branch.
- No production Supabase table is used for test records.
- No production Payhip webhook URL is replaced.
- No current production URL is redirected.
- Every staging page is clearly labeled `STAGING`.

## Rollback

Because production remains untouched, rollback during staging means disabling or deleting only the staging deployment. Production should continue operating without any restoration step.
