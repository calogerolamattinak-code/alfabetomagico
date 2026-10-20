export function triggerConfetti(options?: { particleCount?: number; spread?: number; origin?: { y?: number } }) {
  if (typeof window === 'undefined') return;

  const count = options?.particleCount || 40;
  const colors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24'];

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const startY = (options?.origin?.y ?? 0.5) * window.innerHeight;
  const startX = window.innerWidth / 2;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 10 + 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 250 + 150;
    const destX = startX + Math.cos(angle) * velocity;
    const destY = startY + Math.sin(angle) * velocity + 150;

    el.style.position = 'absolute';
    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = color;
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
    el.style.opacity = '1';
    el.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
    el.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(el);

    // Trigger animation in next frame
    requestAnimationFrame(() => {
      el.style.left = `${destX}px`;
      el.style.top = `${destY}px`;
      el.style.opacity = '0';
      el.style.transform = `rotate(${Math.random() * 720}deg) scale(0.5)`;
    });
  }

  setTimeout(() => {
    container.remove();
  }, 1300);
}
