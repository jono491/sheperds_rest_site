async function loadContent() {
  const res = await fetch('content.json');
  if (!res.ok) return;
  const data = await res.json();
  document.getElementById('about').innerHTML = '<h2>About</h2><p>'+ (data.about || '') +'</p>';
  document.getElementById('menu').innerHTML = '<h2>Menu</h2>' + (data.menu || []).map(i => '<p>'+i.name+' - '+i.price+'</p>').join("");
  document.getElementById('events').innerHTML = '<h2>Events</h2><p>'+ (data.events || '') +'</p>';
  document.getElementById('hours').innerHTML = '<h2>Hours</h2><p>'+ (data.hours || '') +'</p>';
  document.getElementById('contact').innerHTML = '<h2>Contact</h2><p>'+ (data.contact || '') +'</p>';
  if (data.gallery) {
    document.getElementById('gallery').innerHTML = '<h2>Gallery</h2>' + data.gallery.map(img => '<img src="'+img+'" width="150">').join("");
  }
  if (data.booking) {
    document.getElementById('booking').innerHTML = '<h2>Booking</h2><a href="'+data.booking+'" target="_blank">Book Now</a>';
  }
}
window.onload = loadContent;
