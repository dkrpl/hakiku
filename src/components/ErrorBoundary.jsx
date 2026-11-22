import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload = () => {
    this.setState({ hasError: false });
    if (this.props.onRecover) {
      this.props.onRecover();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-dvh flex items-center justify-center p-6 bg-parchment">
          <section className="story-panel max-w-lg w-full p-6 sm:p-8 text-center">
            <h1 className="story-heading-page mb-3">Terjadi Kendala Tampilan</h1>
            <p className="story-body text-ink-muted mb-6">
              Halaman mengalami gangguan tak terduga. Tekan tombol di bawah untuk memuat ulang
              tampilan HAKIKU tanpa menghapus progres tersimpan.
            </p>
            <button type="button" onClick={this.handleReload} className="story-btn story-btn-gold">
              Muat Ulang Tampilan
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
