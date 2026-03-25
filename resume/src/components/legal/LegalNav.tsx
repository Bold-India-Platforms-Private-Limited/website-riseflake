import Link from 'next/link';
import { useRouter } from 'next/router';

const LegalNav = () => {
    const router = useRouter();
    const currentPath = router.pathname;

    const navItems = [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
        { label: 'Refund Policy', href: '/refund-policy' },
    ];

    return (
        <nav className="flex flex-wrap gap-2 mb-8 p-1 bg-slate-100 rounded-xl w-fit">
            {navItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                            }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default LegalNav;
