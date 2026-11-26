// Brand photos in /public (sent by Yousef / saved from @crumbnco.__). w/h are the real pixel sizes.
export const IG_URL = 'https://www.instagram.com/crumbnco.__/';
const post = (id) => `${IG_URL}p/${id}/`;
export const P = {
  nutella: { src: '/photos/photo-nutella-stack.jpg', w: 1206, h: 1495, alt: 'Stack of cookies split open with melted chocolate' },
  molten: { src: '/photos/photo-molten-choc-stack.jpg', w: 1206, h: 1502, alt: 'Chocolate cookies with a molten ganache centre' },
  classic: { src: '/photos/photo-classic-sea-salt.jpg', w: 1206, h: 1770, alt: 'Chocolate chunk cookies with sea salt on baking paper' },
  bueno: { src: '/photos/photo-bueno-cookies.jpg', w: 1206, h: 2139, alt: 'Cookies topped with chocolate bar pieces and cream' },
  box: { src: '/photos/box-assorted.jpg', w: 1206, h: 2128, alt: 'A box of assorted cookies' },
  dough: { src: '/photos/story-dough-and-box.jpg', w: 1206, h: 2126, alt: 'Cookie dough in a bowl, then a box of finished cookies' },
  oreo: { src: '/photos/story-oreo-board.jpg', w: 1206, h: 2137, alt: 'Oreo and white chocolate cookies on a board' },
  tray1: { src: '/photos/market-tray-1.jpg', w: 1206, h: 1590, alt: 'Frosted cookies on a cooling rack next to branded bags' },
  tray2: { src: '/photos/market-tray-2.jpg', w: 1206, h: 1600, alt: 'Cookies on a rack and wrapped cookies with Crumb & Co. stickers' },
  tray3: { src: '/photos/market-tray-3.jpg', w: 1206, h: 2137, alt: 'Cookies in clear boxes and on a rack' },
  dealer: { src: '/photos/poster-cookie-dealer.jpg', w: 1206, h: 1495, alt: 'Poster: support your local cookie dealer', href: post('DX9ulwGMwcV') },
  midnight: { src: '/photos/menu-midnight-milk.jpg', w: 1206, h: 1504, alt: 'Menu poster: Midnight & Milk', href: post('DOQGWlmjNa5') },
  ganache: { src: '/photos/menu-molten-ganache.jpg', w: 1206, h: 1497, alt: 'Menu poster: molten chocolate ganache', href: post('DORhDc3jFec') },
  pretzel: { src: '/photos/menu-pretzel-party.jpg', w: 1206, h: 1497, alt: 'Menu poster: Pretzel Party', href: post('DOS6XFqDK8E') },
  soon: { src: '/photos/coming-soon.jpg', w: 1206, h: 1482, alt: 'Poster: Crumb & Co. cookie coming soon', href: post('DONqeGEDKe6') },
  cheat: { src: '/instagram/poster-cheat-day.jpg', w: 512, h: 640, alt: 'Poster: you deserve a cheat day', href: post('DYAHMS7DCCm') },
};
