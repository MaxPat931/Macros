const updates = [];
for (const token of canvas.scene.tokens) {
  if (!token.actor?.randomImg) continue;
  const images = await token.actor.getTokenImages();
  const img = images[Math.floor(Math.random() * images.length)];
  updates.push({_id: token.id, "texture.src": img});
}
return canvas.scene.updateEmbeddedDocuments("Token", updates);
