"""Reproduce the two Brownian-motion figures with NumPy and Matplotlib.

Run: python3 generate_plots.py
Both figures use one seeded draw of Gaussian coefficients.
The gray reference is a finite 2,048-mode approximation, not an exact path.
"""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import PercentFormatter, ScalarFormatter

OUT = Path(__file__).resolve().parent
rng = np.random.default_rng(42)
t = np.linspace(0, 1, 4097)
n = np.arange(1, 2049)
eigenvalues = 1 / (np.pi * (n - 0.5)) ** 2
coefficients = rng.standard_normal(n.size)
paths = {}
partial = np.zeros_like(t)
for k, (z, eigenvalue) in enumerate(zip(coefficients, eigenvalues), start=1):
    partial += np.sqrt(2 * eigenvalue) * z * np.sin(np.pi * (k - 0.5) * t)
    if k in (1, 5, 20, 100, 2048):
        paths[k] = partial.copy()

counts = np.arange(1, 101)
captured = np.cumsum(eigenvalues[:100]) / 0.5
assert np.all(np.diff(captured) > 0) and np.all(captured < 1)
assert np.isclose(captured[0], 8 / np.pi**2)
colors = {1: '#d95f02', 5: '#009e73', 20: '#b000b5', 100: '#0076c8'}
plt.rcParams.update({
    'font.family': 'serif', 'font.serif': ['cmr10'], 'mathtext.fontset': 'cm',
    'axes.formatter.use_mathtext': True, 'font.size': 15, 'axes.titlesize': 19,
    'axes.labelsize': 16, 'axes.spines.top': False, 'axes.spines.right': False,
    'axes.titleweight': 'normal', 'axes.labelcolor': '#222', 'text.color': '#222',
    'svg.fonttype': 'path',
})

def save(fig, name):
    for extension in ('png', 'svg'):
        fig.savefig(OUT / f'{name}.{extension}', dpi=200, bbox_inches='tight',
                    pad_inches=0.28, facecolor='white')
    plt.close(fig)

fig, ax = plt.subplots(figsize=(8.2, 5.5))
fig.subplots_adjust(left=0.13, right=0.98, top=0.88, bottom=0.28)
ax.plot(t, paths[2048], color='#b9bec5', linewidth=0.8,
        label='2,048-mode reference', zorder=1)
for k in (1, 5, 20, 100):
    ax.plot(t, paths[k], color=colors[k], linewidth=2.1 if k < 100 else 1.6,
            label=rf'$N = {k}$', alpha=0.95)
ax.set(title='One realization, more modes', xlabel=r'Time $t$',
       ylabel=r'$B_N(t)$', xlim=(0, 1))
ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.22),
          ncol=3, fontsize=12, frameon=False)
save(fig, 'brownian-reconstruction')

fig, ax = plt.subplots(figsize=(8.2, 5.2))
fig.subplots_adjust(left=0.17, right=0.98, top=0.88, bottom=0.17)
ax.plot(counts, captured, color='#35465b', linewidth=2.6)
ax.axhline(1, color='#a6a6a6', linewidth=1, linestyle='--')
for k in (1, 5, 20, 100):
    value = captured[k - 1]
    ax.scatter(k, value, color=colors[k], s=40, zorder=3)
    offset = {1: (12, 5), 5: (18, -28), 20: (10, -30), 100: (-5, -30)}[k]
    ax.annotate(f'{value:.1%}', (k, value), xytext=offset,
                textcoords='offset points', ha='right' if k == 100 else 'left',
                color=colors[k], fontsize=14,
                bbox=dict(facecolor='white', edgecolor='none', pad=2))
ax.set(xscale='log', xlim=(0.9, 120), ylim=(0.78, 1.015),
       title='Variance captured', xlabel=r'Number of modes $N$ (log scale)',
       ylabel=r'$\sum_{n=1}^{N}\lambda_n\,/\,\sum_{n=1}^{\infty}\lambda_n$')
ax.set_xticks([1, 5, 20, 100])
ax.xaxis.set_major_formatter(ScalarFormatter())
ax.yaxis.set_major_formatter(PercentFormatter(1, decimals=0))
save(fig, 'brownian-variance')
print('Saved two separate Brownian-motion figures.')
