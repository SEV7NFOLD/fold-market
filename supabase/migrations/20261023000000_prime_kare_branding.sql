-- Match the Prime Kare storefront to the supplied transparent red wordmark.
update public.vendors
set accent_color = '#e90000',
    logo_url = '/brand/prime-kare-transparent.svg',
    updated_at = now()
where handle = 'prime-kare';
