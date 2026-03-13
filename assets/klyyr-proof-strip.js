if (!customElements.get('klyyr-proof-strip')) {
  class KlyyrProofStrip extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-proof-track]');
      this.mobileMediaQuery = window.matchMedia('(max-width: 749px)');
      this.motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.boundUpdate = this.updateAutoplay.bind(this);

      this.mobileMediaQuery.addEventListener('change', this.boundUpdate);
      this.motionMediaQuery.addEventListener('change', this.boundUpdate);

      this.addEventListener('pointerdown', () => this.pauseAutoplay(), { passive: true });
      this.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.addEventListener('mouseleave', () => this.updateAutoplay());

      this.updateAutoplay();
    }

    disconnectedCallback() {
      this.clearAutoplay();
      this.mobileMediaQuery?.removeEventListener('change', this.boundUpdate);
      this.motionMediaQuery?.removeEventListener('change', this.boundUpdate);
    }

    pauseAutoplay() {
      this.clearAutoplay();
    }

    clearAutoplay() {
      if (this.intervalId) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }

    updateAutoplay() {
      this.clearAutoplay();

      if (!this.track || this.dataset.mobileAutoplay !== 'true') {
        return;
      }

      if (!this.mobileMediaQuery.matches || this.motionMediaQuery.matches) {
        return;
      }

      const intervalSeconds = Number(this.dataset.intervalSeconds || 4);
      const intervalMs = Math.max(intervalSeconds, 2) * 1000;

      this.intervalId = window.setInterval(() => {
        const items = Array.from(this.track.children);
        if (!items.length) {
          return;
        }

        const currentLeft = this.track.scrollLeft;
        const nextItem = items.find((item) => item.offsetLeft > currentLeft + 24) || items[0];

        this.track.scrollTo({
          left: nextItem.offsetLeft,
          behavior: 'smooth'
        });
      }, intervalMs);
    }
  }

  customElements.define('klyyr-proof-strip', KlyyrProofStrip);
}
