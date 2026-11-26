import React from 'react';
import { Cookie, Menu as MenuIcon, Search as SearchIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CommandItem, SearchModal } from '@/components/ui/search-modal';
import Link from 'next/link';

export function Header() {
    const [open, setOpen] = React.useState(false);

    const links = [
        { label: 'Menu', href: '/menu' },
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full border-b-4 border-amber-900 backdrop-blur-lg',
                'bg-[#FFF8E7]/95 supports-[backdrop-filter]:bg-[#FFF8E7]/80',
            )}
        >
            <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
                <div className="hover:bg-pink-200 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 duration-100 transition-colors">
                    <Cookie className="size-8 text-amber-900" />
                    <p className="font-['Chewy'] text-2xl tracking-wide text-amber-900 pt-1">Crumb & Co.</p>
                </div>
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <div className="hidden items-center gap-1 lg:flex">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                className={cn(buttonVariants({ variant: 'ghost' }), "hover:bg-pink-200 hover:text-amber-900 text-base")}
                                href={link.href}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <SearchModal data={blogs}>
                        <Button
                            variant="outline"
                            className="relative size-10 cursor-pointer p-0 md:border-2 md:border-amber-900 xl:h-10 xl:w-60 xl:justify-between xl:px-4 xl:py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(60,42,33,1)] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(60,42,33,1)]"
                        >
                            <span className="hidden xl:inline-flex text-amber-900/70">Search for cookies...</span>
                            <span className="sr-only">Search</span>
                            <SearchIcon className="size-5 text-amber-900" />
                        </Button>
                    </SearchModal>
                    <Sheet open={open} onOpenChange={setOpen}>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setOpen(!open)}
                            className="lg:hidden border-2 border-amber-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(60,42,33,1)] text-amber-900"
                        >
                            <MenuIcon className="size-5" />
                        </Button>
                        <SheetContent
                            className="bg-[#FFF8E7]/95 supports-[backdrop-filter]:bg-[#FFF8E7]/80 gap-0 backdrop-blur-lg border-amber-900 text-amber-900"
                            showClose={false}
                            side="left"
                        >
                            <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5 font-bold">
                                {links.map((link) => (
                                    <Link
                                        key={link.label}
                                        className={cn(buttonVariants({
                                            variant: 'ghost',
                                            className: 'justify-start hover:bg-pink-200 text-lg',
                                        }))}
                                        href={link.href}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                            <SheetFooter>
                                <Button className="bg-amber-900 text-white hover:bg-amber-800 rounded-xl">Sign In</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}

const blogs: CommandItem[] = [
    { id: 'item-1', title: 'Chocolate Chip', description: 'Our classic, gooey chocolate chip cookie.', category: 'Classic' },
    { id: 'item-2', title: 'Double Fudge', description: 'For the ultimate chocolate lovers.', category: 'Chocolate' },
    { id: 'item-3', title: 'Strawberry Dream', description: 'A cute pink cookie with dried strawberries.', category: 'Fruity' },
    { id: 'item-4', title: 'Matcha White Choc', description: 'Earthy matcha meets sweet white chocolate.', category: 'Specialty' },
];
