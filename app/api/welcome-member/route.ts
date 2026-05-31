import { NextResponse } from 'next/server';
import { ratelimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';


function buildWelcomeEmail(username: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to The Lounge</title>
</head>
<body style="margin:0;padding:0;background-color:#edeae4;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1a1a1a;">
    <tr>
      <td style="padding:10px 24px;">
        <p style="margin:0;font-size:11px;letter-spacing:2px;color:#ffffff;font-family:'Georgia',serif;">
          For the ones who keep it all running &nbsp;·&nbsp; For the ones who keep it all running
        </p>
      </td>
    </tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#edeae4;padding:32px 20px 48px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:28px 0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td><h1 style="margin:0;font-size:30px;font-weight:700;color:#1a1a1a;font-family:'Georgia',serif;">The Lounge</h1></td>
                  <td align="right" valign="middle"><span style="display:inline-block;padding:5px 14px;background-color:#1a1a1a;border-radius:20px;font-size:11px;color:#ffffff;font-family:'Georgia',serif;letter-spacing:1px;">Welcome</span></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;">
                <tr><td style="height:4px;background-color:#e8602c;"></td></tr>
                <tr>
                  <td style="padding:32px 36px 36px;">
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr><td><span style="display:inline-block;padding:5px 14px;border:1.5px solid #e8602c;border-radius:20px;font-size:11px;color:#e8602c;font-family:'Georgia',serif;letter-spacing:1px;text-transform:uppercase;">🎉 You're in</span></td></tr>
                    </table>
                    <h2 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1a1a1a;font-family:'Georgia',serif;line-height:1.3;">Welcome to The Lounge, ${username}.</h2>
                    <p style="margin:0 0 24px;font-size:17px;font-style:italic;color:#2a2a2a;font-family:'Georgia',serif;line-height:1.65;">Your membership has been approved. You're now part of a private community built for administrative and executive support professionals — whether you work remotely, in an office, or anywhere in between.</p>
                    <div style="height:1px;background-color:#eeebe6;margin-bottom:24px;"></div>
                    <p style="margin:0 0 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#aaa;font-family:'Georgia',serif;">What The Lounge is for</p>
                    <p style="margin:0 0 24px;font-size:15px;color:#444;font-family:'Georgia',serif;line-height:1.7;">The Lounge is a closed, invite-only space for people working in admin, executive support, operations, and related roles — remote or office-based. It's where you can share experiences, seek advice, vent about the chaos, celebrate your wins, and find community with others who understand the realities of the work you do.</p>
                    <div style="height:1px;background-color:#eeebe6;margin-bottom:24px;"></div>
                    <p style="margin:0 0 16px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#aaa;font-family:'Georgia',serif;">Community rules</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;background-color:#f9f8f6;border-radius:10px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0 0 10px;font-size:12px;font-weight:bold;color:#1a1a1a;letter-spacing:1px;text-transform:uppercase;">✓ Please do</p>
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">Be respectful, even when you disagree</td></tr>
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">Support and lift up fellow members</td></tr>
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">Post honestly and authentically</td></tr>
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">Keep what's shared here, within here</td></tr>
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">Promote your own services and events — we love to celebrate each other</td></tr>
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;">Use the events page to invite and advertise your own events</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;background-color:#fff5f3;border-radius:10px;border-left:3px solid #e8602c;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0 0 10px;font-size:12px;font-weight:bold;color:#e8602c;letter-spacing:1px;text-transform:uppercase;">✕ Please don't</p>
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">Harass, bully, or intimidate any member</td></tr>
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">Share another member's posts or personal details outside the platform</td></tr>
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">Spam or cold pitch other members</td></tr>
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;padding-bottom:6px;">Share confidential or sensitive information that could identify or harm others</td></tr>
                            <tr><td valign="top" width="16" style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;">·</td><td style="font-size:14px;color:#444;font-family:'Georgia',serif;line-height:1.6;">Use The Lounge primarily as a sales channel</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;background-color:#1a1a1a;border-radius:10px;">
                      <tr>
                        <td style="padding:16px 20px;">
                          <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#c9a96e;letter-spacing:1px;text-transform:uppercase;">What happens in The Lounge, stays in The Lounge</p>
                          <p style="margin:0;font-size:13px;color:#aaa;font-family:'Georgia',serif;line-height:1.6;">This is a space for candid, personal conversation. Screenshotting or sharing another member's words outside the community is a serious violation and will result in immediate removal.</p>
                        </td>
                      </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#1a1a1a;border-radius:24px;">
                          <a href="https://theloungecommunity.co.uk" style="display:inline-block;padding:13px 28px;font-size:13px;color:#ffffff;text-decoration:none;font-family:'Georgia',serif;font-weight:bold;letter-spacing:0.5px;">Enter The Lounge →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 4px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#aaa;font-family:'Georgia',serif;">© 2026 Your Virtual Office Manager Ltd · <a href="https://theloungecommunity.co.uk" style="color:#aaa;text-decoration:none;">theloungecommunity.co.uk</a></p>
                    <p style="margin:4px 0 0;font-size:12px;color:#aaa;font-family:'Georgia',serif;"><a href="https://theloungecommunity.co.uk/terms" style="color:#aaa;">Terms of Use</a> &nbsp;·&nbsp; <a href="https://theloungecommunity.co.uk/privacy" style="color:#aaa;">Privacy Policy</a></p>
                  </td>
                  <td align="right" valign="middle">
                    <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ccc;font-family:'Georgia',serif;">Your people. Your space.<br/>No judgement.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email } = body;
const ip = (await headers()).get('x-forwarded-for') ?? 'anonymous'
const { success } = await ratelimit.limit(ip)
if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    if (!email) {
      return NextResponse.json({ error: 'No email provided' }, { status: 400 });
    }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Lounge <hello@theloungecommunity.co.uk>',
        to: email,
        subject: "☕ Welcome to The Lounge — you're in!",
        html: buildWelcomeEmail(username || 'there'),
      })
    });

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
  }
}
