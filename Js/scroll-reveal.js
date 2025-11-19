document.addEventListener('DOMContentLoaded', () => {
	const revealElements = document.querySelectorAll('[data-reveal], .reveal');

	if (!revealElements.length || !('IntersectionObserver' in window)) {
		return;
	}

	document.body.classList.add('scroll-animations-ready');

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const target = entry.target;
			const revealOnce = target.dataset.revealOnce !== 'false';

			if (entry.isIntersecting) {
				target.classList.add('reveal--visible');
				if (revealOnce) {
					observer.unobserve(target);
				}
			} else if (!revealOnce) {
				target.classList.remove('reveal--visible');
			}
		});
	}, {
		threshold: 0.15,
		rootMargin: '0px 0px -5% 0px'
	});

	revealElements.forEach((element) => {
		const delay = element.dataset.revealDelay;
		if (delay) {
			element.style.setProperty('--reveal-delay', `${parseInt(delay, 10)}ms`);
		}
		observer.observe(element);
	});
});

