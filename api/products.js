// /api/products — список товаров для витрины (мок без БД)
const products = [
  { id: 'p1', title: 'CJ DREAM SWEATSHORTS', price: 95,  image: 'https://images.unsplash.com/photo-1618354691438-c1d3b5a6f3d5?w=1000&auto=format&fit=crop' },
  { id: 'p2', title: 'JACK RETRO BASEBALL JERSEY', price: 120, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop' },
  { id: 'p3', title: 'HOUSTON TO ISE MIE HOODIE', price: 165, image: 'https://images.unsplash.com/photo-1542060748-10c28b62716a?w=1000&auto=format&fit=crop' },
  { id: 'p4', title: 'WIND ZIP JACKET', price: 145, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop' },
  { id: 'p5', title: 'NYLON CAP', price: 50, image: 'https://images.unsplash.com/photo-1520975922284-9c5a3b69a88f?w=1000&auto=format&fit=crop' },
  { id: 'p6', title: 'LS TEE DUST', price: 85, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop' },
  { id: 'p7', title: 'WORK JACKET BLACK', price: 180, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&auto=format&fit=crop' },
  { id: 'p8', title: 'DENIM SHORTS', price: 110, image: 'https://images.unsplash.com/photo-1520975867597-0f2a7e5f2b39?w=1000&auto=format&fit=crop' },
  { id: 'p9', title: 'GRAPHIC HOODIE OCHRE', price: 165, image: 'https://images.unsplash.com/photo-1556909190-eccf4a8bf87d?w=1000&auto=format&fit=crop' }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ products });
};
