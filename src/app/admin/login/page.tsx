import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/app/admin/actions";

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string; setup?: string }> }) {
  const query = await searchParams;
  return <main className="admin-auth"><div className="admin-auth-card"><Link href="/" className="admin-logo"><Image src="/brand/prime-kare-transparent.svg" alt="Prime Kare" width={82} height={62} unoptimized /></Link><div className="eyebrow"><span className="eyebrow-line" />Vendor studio</div><h1>Welcome <em>back.</em></h1><p>Sign in to manage your storefront and products.</p>
    {query.setup && <div className="notice notice-warm"><strong>Connect your store</strong><span>Add your Supabase URL and public anon key to the Vercel project environment, then redeploy. See the setup guide for database and auth steps.</span></div>}
    {query.error === "access" && <div className="notice notice-error">This account does not have an editor membership for any vendor.</div>}
    {query.error === "signin" && <div className="notice notice-error">We couldn’t sign you in. Check your email and password and try again.</div>}
    {query.error === "credentials" && <div className="notice notice-error">Enter a valid email address and password.</div>}
    <form action={signIn} className="admin-form"><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@yourbrand.com" /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="button button-dark" type="submit">Sign in <span>→</span></button></form>
    <Link className="admin-back" href="/">← Back to storefront</Link></div></main>;
}

