---
layout: distill
title: Kosambi–Karhunen–Loève Expansion
date: 2026-10-06 00:00:00
description: A derivation of the Kosambi expansion, with Brownian motion as an example and a brief extension to complex vector fields.
tags: math
categories:
related_posts: false
---

<div class="kosambi-notes">
<p>The Kosambi expansion is the continuous analogue of principal components analysis (PCA). Eigenfunctions replace covariance matrix eigenvectors, and retaining the modes with the largest eigenvalues gives the smallest integrated mean-square reconstruction error for a fixed number of modes.</p>
<p>Consider a second order mean-square continuous<d-footnote>Second order means that $\mathbb{E}[X(t)^2] < \infty\quad\forall t$. We need this in order to define the variance of the coefficients. The process $X(t)$ is mean-square continuous if $\mathbb{E}[|X(t+h)-X(t)|^2]\to 0$ as $h\to 0$. Together with the finite second moments assumed above, this ensures continuity of its covariance kernel, which we define below, and is sufficient for the expansion used here.</d-footnote> real-valued zero-mean stochastic process $X(t)$, $t\in[a,b]$. We want to express it in terms of an orthonormal basis of deterministic functions with zero-mean uncorrelated random coefficients:</p>

\begin{align}
    X(t) = \sum_{n=1}^{\infty} X_n \phi_n(t).
\end{align}
<p>We have</p>

\begin{align}
    X_n = \int_a^b X(t)\phi_n(t)\,\mathrm{d} t.
\end{align}
<p>From here we can see that $X_n$ is zero-mean (because $X(t)$ is zero-mean and we assumed it is nice enough to interchange the expectation operator with the integral). Now we want to see what requiring the coefficients to be uncorrelated implies:</p>

\begin{align}
    \mathbb{E}[X_nX_m] &= \mathbb{E}\int_a^b X(t)\phi_n(t)\,\mathrm{d} t \int_a^b X(s)\phi_m(s)\,\mathrm{d} s\\
    &= \int_a^b\int_a^b \phi_n(t)\phi_m(s) \mathbb{E}[X(t)X(s)]\,\mathrm{d} t \,\mathrm{d} s\\
    &= \int_a^b\int_a^b \phi_n(t)\phi_m(s) R_X(t,s)\,\mathrm{d} t \,\mathrm{d} s.
\end{align}
<p>Here $R_X(t,s)=\mathbb{E}[X(t)X(s)]$ is the covariance function, since $X(t)$ has zero mean.</p>
<p>Because we would like the coefficients $X_n$ to be uncorrelated, the double integral in equation (5) should be of the form $\lambda_n\delta_{nm}$:</p>

\begin{align}
    \int_a^b\int_a^b \phi_n(t)\phi_m(s) R_X(t,s)\,\mathrm{d} t \,\mathrm{d} s &= \lambda_n\delta_{nm}\\
    \implies \int_a^b R_X(t,s) \phi_n(s)\,\mathrm{d} s &= \lambda_n \phi_n(t).
\end{align}
<p>Therefore, by solving equation (7), we can find the orthonormal basis functions of the expansion. This equation implies that these basis functions are the eigenfunctions of the covariance operator of the process. The covariance function $R_X(t,s)$ is the kernel of this operator, with corresponding eigenpairs $(\lambda_n,\phi_n)$. Note that by putting $n=m$ we find $\mathbb{E}[X_n^2] = \mathrm{Var}[X_n] = \lambda_n$, i.e., the variances of the coefficients $X_n$ are equal to the eigenvalues of the covariance operator. The second moment of $X_n$ is exactly the variance of $X_n$ because, again, these coefficients are zero-mean. Often people like to perform a sort of normalization by noting the following:</p>

\begin{align}
    \mathrm{Var}[X_n] &= \lambda_n\\
    \implies \frac{1}{\lambda_n}\mathrm{Var}[X_n] &= 1\\
    \implies \mathrm{Var}\left[\frac{X_n}{\sqrt{\lambda_n}}\right] &=1.
\end{align}
<p>For $\lambda_n>0$, set $X_n/\sqrt{\lambda_n}=Z_n$, or $X_n=\sqrt{\lambda_n}Z_n$. Then we can write the Kosambi expansion as</p>

\begin{align}
    X(t) = \sum_{n=1}^{\infty} \sqrt{\lambda_n}Z_n\phi_n(t)
\end{align}
<p>where now the random coefficients are zero-mean and unit-variance, scaled by the square roots of the eigenvalues of the covariance operator with kernel $R_X(t,s)$. Suppose $X(t)$ met the assumptions above except it had non-zero mean $\mu_X(t)$. Then we could simply subtract off $\mu_X(t)$ and apply equation (11) to the “zero-meaned” process, then add in the mean again at the end. We write this slightly more general version of the Kosambi expansion:</p>
<div style="border: 1px solid currentColor; padding: 1rem; margin: 1.5rem 0;">
<p>Suppose $X(t)$ is a second-order mean-square continuous real-valued stochastic process defined over $t\in[a,b]$ with mean $\mu_X(t)$ and covariance function $R_X(t,s)$. Then we can write it as the Kosambi expansion</p>

\begin{equation}
    X(t) = \mu_X(t) + \sum_{n=1}^{\infty} \sqrt{\lambda_n}Z_n\phi_n(t),
\end{equation}
<p>where</p>

\begin{equation}
\begin{aligned}
    \mathbb{E}[Z_n] &= 0, & \mathbb{E}[Z_nZ_m] &=\delta_{nm},\\
    \int_a^b R_X(t,s) \phi_n(s)\,\mathrm{d}s &= \lambda_n \phi_n(t), & 
    \int_a^b \phi_n(t) \phi_m(t)\,\mathrm{d}t &= \delta_{nm}.
\end{aligned}
\end{equation}
</div>
<p>Here $\delta_{nm}$ is the Kronecker delta: it equals $1$ when $n=m$ and $0$ otherwise.</p>
<p>The series in equation (12) converges in mean square, i.e., for each fixed $t\in[a,b]$, the partial sums over the positive eigenvalue modes satisfy</p>
<div>
\begin{gather}
S_N(t) = \mu_X(t)+\sum_{n=1}^{N}\sqrt{\lambda_n}Z_n\phi_n(t),\\
\lim_{N\to\infty}\mathbb{E}\left[|X(t)-S_N(t)|^2\right] = 0.
\end{gather}
</div>
<p>Modes with $\lambda_n=0$ have zero variance and contribute nothing, so we omit them.</p>
<p>As an example, take $X(t) = B(t), t\in[0,1]$  the standard Brownian motion<d-footnote>Brownian motion is also called the Wiener process, after Norbert Wiener, who gave it a rigorous mathematical foundation.</d-footnote>. This has covariance function $\min(t,s)$; this is derived in the appendix. Then we need to solve</p>

\begin{align}
    \int_0^1 \min(t,s)\phi_n(s)\,\mathrm{d} s = \lambda_n \phi_n(t).
\end{align}
<p>To solve this, split the integral at $s=t$:</p>
<div>
\begin{equation}
\lambda_n\phi_n(t)
=\int_0^t s\phi_n(s)\,\mathrm{d}s
+\int_t^1t \phi_n(s)\,\mathrm{d}s.
\end{equation}
</div>
<p>Differentiating equation (17) once with respect to $t$, then once more, gives</p>
<div>
\begin{align}
\lambda_n\phi_n'(t)&=\int_t^1\phi_n(s)\,\mathrm{d}s,\\
\lambda_n\phi_n''(t)&=-\phi_n(t).
\end{align}
</div>
<p>Putting $t=0$ in equation (17) gives $\phi_n(0)=0$, while putting $t=1$ in equation (18) gives $\phi_n'(1)=0$. The differential equation (19) has sine and cosine solutions. The first condition leaves $\phi_n(t)=A\sin(t/\sqrt{\lambda_n})$, and the second requires $\cos(1/\sqrt{\lambda_n})=0$. Hence $1/\sqrt{\lambda_n}=\pi(n-1/2)$ for $n=1,2,\ldots$. Choosing $A=\sqrt{2}$ so that $\int_0^1\phi_n(t)^2\,\mathrm{d}t=1$ gives</p>

\begin{align}
    \phi_n(t) &= \sqrt{2} \sin(\pi (n-1/2)t)\\
    \sqrt{\lambda_n} &= \frac{1}{\pi\left(n-\frac{1}{2}\right)}\\
    \implies B(t) &= \sum_{n=1}^{\infty} Z_n\frac{\sqrt{2}}{\pi(n-1/2)} \sin(\pi(n-1/2)t)
\end{align}
<p>where $Z_n\sim \mathcal{N}(0,1)$.</p>
<p>Because Brownian motion is Gaussian, its projection coefficients are jointly Gaussian; being uncorrelated, the normalized coefficients $Z_n$ are therefore independent standard normals.</p>
<h2>Visualizing the expansion</h2>
<p>Let's start with one realization of Brownian motion and see what happens as we keep more modes in its expansion. For $N\ge 1$, let $B_N(t)$ be the sum of the first $N$ terms in equation (22). <a href="#fig-brownian-expansion">Figure 1</a> shows the resulting partial sums.</p>
<figure id="fig-brownian-expansion" class="kosambi-figure">
  <img src="/assets/img/kosambi-expansion/brownian-reconstruction.svg?v=4" class="rounded z-depth-1" alt="Brownian series truncations with 1, 5, 20, and 100 shared random coefficients against a 2,048-mode reference.">
  <figcaption class="caption"><strong>Figure 1.</strong> Partial sums $B_N(t)$ with $N=1,5,20,100$, all using the same random coefficients; the gray reference uses 2,048 modes.</figcaption>
</figure>
<p>The first modes capture the broad shape of this path, while later ones add finer fluctuations. To measure how much those modes contribute across realizations, we can turn to the covariance function.</p>
<p>The covariance function of $X(t)$ can be written in terms of its Kosambi expansion in equation (12). In the calculation below, $X_n=\sqrt{\lambda_n}Z_n$, as defined earlier:</p>
<div>
\begin{align}
R_X(t,s)
&= \mathbb{E}[(X(t) - \mu_X(t))(X(s)-\mu_X(s))]\quad \text{by definition}\\
&= \mathbb{E}\left[\sum_{n=1}^{\infty} X_n\phi_n(t)\sum_{m=1}^{\infty} X_m \phi_m(s)\right] \\
&= \sum_{n=1}^{\infty}\sum_{m=1}^{\infty}\mathbb{E}[X_nX_m]\phi_n(t)\phi_m(s)\\
&= \sum_{n=1}^{\infty}\sum_{m=1}^{\infty}\lambda_n\delta_{nm}\phi_n(t)\phi_m(s)\\
&= \sum_{n=1}^{\infty}\lambda_n\phi_n(t)\phi_n(s).
\end{align}
</div>
<p>Setting $s=t$ gives the variance at time $t$:</p>
<div>
\begin{equation}
R_X(t,t)=\sum_{n=1}^{\infty}\lambda_n\phi_n(t)^2.
\end{equation}
</div>
<p>Now integrate the pointwise variance over $[a,b]$. Interchanging the sum and the integral, then using the fact that each $\phi_n$ has unit squared integral, gives</p>
<div>
\begin{align}
\int_a^b R_X(t,t)\, \mathrm{d}t
&= \int_a^b \sum_{n=1}^{\infty} \lambda_n\phi_n(t)^2\, \mathrm{d}t\\
&= \sum_{n=1}^{\infty} \lambda_n \int_a^b \phi_n(t)^2\, \mathrm{d}t\\
&= \sum_{n=1}^{\infty} \lambda_n.
\end{align}
</div>
<p>For Brownian motion, $R_B(t,s)=\min(t,s)$, so $R_B(t,t)=t$. The total variance across $[0,1]$ is</p>
<div>
\begin{align}
\sum_{n=1}^{\infty} \lambda_n
&= \int_0^1 R_B(t,t)\, \mathrm{d}t\\
&= \int_0^1 t\, \mathrm{d}t = \frac{1}{2}.
\end{align}
</div>
<p>Now consider the $N$th partial sum of the Brownian motion expansion. We found its eigenvalues above by solving the covariance integral equation: squaring equation (21) gives $\lambda_n=1/[\pi^2(n-1/2)^2]$. The first $N$ modes capture the sum of their eigenvalues. Dividing this sum by the total variance gives</p>
<div>
\begin{align}
\sum_{n=1}^{N}\lambda_n
&=\sum_{n=1}^{N}\frac{1}{\pi^2(n-1/2)^2},\\
\frac{\sum_{n=1}^{N}\lambda_n}{\sum_{n=1}^{\infty}\lambda_n}
&=\frac{2}{\pi^2}\sum_{n=1}^{N}\frac{1}{(n-1/2)^2}.
\end{align}
</div>
<p><a href="#fig-brownian-variance">Figure 2</a> shows this fraction as $N$ grows. With just the first mode, it is already $8/\pi^2\approx 81.1\%$.</p>
<figure id="fig-brownian-variance" class="kosambi-figure">
  <img src="/assets/img/kosambi-expansion/brownian-variance.svg?v=4" class="rounded z-depth-1" alt="Variance captured rises from 81.1 percent with one mode to 99.8 percent with 100 modes.">
  <figcaption class="caption"><strong>Figure 2.</strong> Fraction of variance captured by the first $N$ modes, using the total $1/2$ in equation (33). This is an ensemble measure, not the fraction of a particular path's squared norm captured.</figcaption>
</figure>

<p>The variance curve summarizes the contribution of the modes across realizations. <a href="#brownian-paths">Figure 3</a> draws individual Brownian paths, tracing each one over time using Gaussian increments.</p>
<link rel="stylesheet" href="/assets/css/brownian-paths.css?v=8">
<div id="brownian-paths">
<p class="brownian-intro">Choose a path count and press Draw.</p>
<div class="brownian-controls">
<label>Paths <select data-count><option value="1">1</option><option value="2">2</option><option value="3" selected>3</option><option value="4">4</option><option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option></select></label>
<label>Playback time <select data-duration><option value="4">4 seconds</option><option value="8" selected>8 seconds</option><option value="16">16 seconds</option></select></label>
<button type="button" data-start>Draw</button>
<button type="button" data-pause disabled>Pause</button>
<button type="button" data-replay disabled>Replay</button>
<button type="button" data-clear disabled>Clear</button>
</div>
<svg role="img" aria-label="Animated independent Brownian paths on the time interval zero to one" viewBox="0 0 700 370"></svg>
<div class="brownian-readout"><span data-status role="status">Ready when you are.</span><span data-time>t = 0.00</span></div>
<p class="caption"><strong>Figure 3.</strong> Independent standard Brownian motions sampled using Gaussian increments with variance equal to the time step, joined by straight lines. These are discrete approximations on $t\in[0,1]$. Playback stretches this unit time interval over the selected number of seconds to make the motion easier to follow; it does not change the simulated process.</p>
<noscript>Enable JavaScript to draw and animate paths.</noscript>
</div>
<script src="/assets/js/brownian-paths.js?v=3" defer></script>

<p>The paths in <a href="#brownian-paths">Figure 3</a> show individual realizations. To see the distribution at each fixed time, <a href="#brownian-density">Figure 4</a> traces Brownian paths alongside their changing Gaussian marginal. For every fixed $t>0$, $B(t)\sim\mathcal{N}(0,t)$: $\mathbb{E}[B(t)]=0$, while $\mathrm{Var}(B(t))=t$. At $t=0$, $B(0)=0$ with certainty.</p>
<div id="brownian-density">
<p class="brownian-intro">Choose a path count and playback time, then press Draw.</p>
<div class="brownian-controls">
<label>Paths <select data-count><option value="1">1</option><option value="2">2</option><option value="3" selected>3</option><option value="4">4</option><option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option></select></label>
<label>Playback time <select data-duration><option value="4">4 seconds</option><option value="8" selected>8 seconds</option><option value="16">16 seconds</option></select></label>
<button type="button" data-start>Draw</button>
<button type="button" data-pause disabled>Pause</button>
<button type="button" data-replay disabled>Replay</button>
<button type="button" data-clear disabled>Clear</button>
</div>
<svg role="img" aria-label="Independent Brownian paths with their changing Gaussian density shown as a third dimension" viewBox="0 0 700 420"></svg>
<div class="brownian-readout"><span data-status role="status">Ready when you are.</span><span data-time>t = 0.00</span></div>
<div class="brownian-distribution" data-distribution>B(0)=0.</div>
<p class="caption"><strong>Figure 4.</strong> The blue lines are independent Brownian paths on the time and value plane; the purple curve is their shared marginal density at each time, lifted into a third dimension. The curve widens and its peak becomes lower as variance grows. Standard Brownian motion is defined with $B(0)=0$, so at $t=0$ its distribution is a point mass at $x=0$, represented formally by the Dirac delta $\delta(x)$. Playback stretches $t\in[0,1]$ over the selected number of seconds.</p>
<noscript>Enable JavaScript to draw and animate paths.</noscript>
</div>
<script src="/assets/js/brownian-density.js?v=18" defer></script>

<h2>Vector-valued processes</h2>
<p>Let's do the complex vector version of the Kosambi expansion, which may be useful for electromagnetics, and electromagnetic information theory in particular. Consider the stochastic process $\mathbf{X}(\mathbf{r}): \Omega \subseteq \mathbb{R}^3 \to \mathbb{C}^3$. Assume $\mathbb{E}\int_\Omega\|\mathbf{X}(\mathbf{r})\|^2\,\mathrm{d}^3\mathbf{r}<\infty$; the expansion below converges in expected squared $L^2(\Omega)$ norm, with only positive eigenvalue modes retained. The Kosambi expansion is</p>

\begin{align}
    \mathbf{X}(\mathbf{r}) = \mu_{\mathbf{X}}(\mathbf{r}) + \sum_{n=1}^{\infty} X_n \mathbf{\Phi}_n(\mathbf{r})
\end{align}
<p>where $\mathbf{\Phi}_n,\mu_{\mathbf{X}}: \Omega \subseteq \mathbb{R}^3 \to \mathbb{C}^3$ and $\mu_{\mathbf{X}}(\mathbf{r}) = \mathbb{E}[\mathbf{X}(\mathbf{r})]$. Throughout the following, we will use the inner product defined by</p>

\begin{align}
    \langle\mathbf{f},\mathbf{g}\rangle = \int_{\Omega} \mathbf{f}(\mathbf{r})^{\mathrm{H}}\mathbf{g}(\mathbf{r})\,\mathrm{d}^3\mathbf{r}.
\end{align}
<p>Here the superscript $\mathrm{H}$ denotes the Hermitian conjugate. We take the $\mathbf{\Phi}_n$ to be orthonormal under this inner product. Using equation (37), the coefficient $X_n$ is</p>

\begin{align}
    X_n = \int_{\Omega} \mathbf{\Phi}_n^{\mathrm{H}}(\mathbf{r}) [\mathbf{X}(\mathbf{r}) - \mu_{\mathbf{X}}(\mathbf{r})]\,\mathrm{d}^3\mathbf{r}.
\end{align}
<p>Using equation (38), we get</p>

\begin{align}
    \mathbb{E}[X_nX_m^*] = \mathbb{E}\int_{\Omega} \mathbf{\Phi}_n^{\mathrm{H}}(\mathbf{r}) [\mathbf{X}(\mathbf{r}) - \mu_{\mathbf{X}}(\mathbf{r})]\,\mathrm{d}^3\mathbf{r}\int_{\Omega} [\mathbf{X}(\mathbf{s}) - \mu_{\mathbf{X}}(\mathbf{s})]^{\mathrm{H}} \mathbf{\Phi}_m(\mathbf{s})\,\mathrm{d}^3\mathbf{s}
\end{align}
<p>In equation (39), $X_m^*$ denotes the complex conjugate of $X_m$. Here we used the identity $(\mathbf{a}^{\mathrm{H}} \mathbf{b})^* = \mathbf{b}^{\mathrm{H}} \mathbf{a}$. Define the matrix-valued covariance function by $\mathbf{R}_{\mathbf{X}}(\mathbf{r},\mathbf{s})=\mathbb{E}[(\mathbf{X}(\mathbf{r})-\mu_{\mathbf{X}}(\mathbf{r}))(\mathbf{X}(\mathbf{s})-\mu_{\mathbf{X}}(\mathbf{s}))^{\mathrm{H}}]$. Interchanging expectation and integration in equation (39) then gives</p>

\begin{align}
    \mathbb{E}[X_nX_m^*] = \int_{\Omega}\int_{\Omega} \mathbf{\Phi}_n^{\mathrm{H}}(\mathbf{r})\mathbf{R}_{\mathbf{X}}(\mathbf{r},\mathbf{s}) \mathbf{\Phi}_m(\mathbf{s})\,\mathrm{d}^3\mathbf{r}\,\mathrm{d}^3\mathbf{s}.
\end{align}
<p>We would like $\mathbb{E}[X_nX_m^*]$ to be equal to $\lambda_n\delta_{nm}$, since we want the coefficients $X_n$ to be uncorrelated. This is true if the $\mathbf{\Phi}_n$ are eigenfunctions of the covariance operator,</p>

\begin{align}
    \int_{\Omega} \mathbf{R}_{\mathbf{X}}(\mathbf{r},\mathbf{s}) \mathbf{\Phi}_n(\mathbf{s})\, \mathrm{d}^3\mathbf{s} = \lambda_n\mathbf{\Phi}_n(\mathbf{r}).
\end{align}
<p>For $\lambda_n>0$, normalize the coefficients by setting $X_n = \sqrt{\lambda_n} Z_n$, where $\mathbb{E}[Z_n] = 0$, $\mathbb{E}|Z_n|^2 = 1$. Then we have</p>

\begin{align}
    \mathbf{X}(\mathbf{r}) = \mu_{\mathbf{X}}(\mathbf{r}) + \sum_{n=1}^{\infty} \sqrt{\lambda_n}Z_n \mathbf{\Phi}_n(\mathbf{r}).
\end{align}
<p>In electromagnetic information theory, this expansion can represent a random electromagnetic field in uncorrelated spatial modes, providing coordinates for studying how information is distributed across those modes.</p>
<p>We could also do a version of this where the vector-valued stochastic process is a function of time. Then the inner product changes accordingly. For example, for vector-valued functions on $[0,1]$, we can use</p>
<div>
\begin{equation}
\langle\mathbf{f},\mathbf{g}\rangle=\int_0^1\mathbf{f}(t)^{\mathrm{H}}\mathbf{g}(t)\,\mathrm{d}t.
\end{equation}
</div>
<p>For a vector-valued process $\mathbf{X}(t)$ on $[0,1]$, let $\mathbf{R}_{\mathbf{X}}(t,s)$ denote its matrix-valued covariance function. The covariance operator's eigenfunctions satisfy</p>
<div>
\begin{equation*}
\int_0^1\mathbf{R}_{\mathbf{X}}(t,s)\mathbf{\Phi}_n(s)\,\mathrm{d}s
=\lambda_n\mathbf{\Phi}_n(t).
\end{equation*}
</div>
<p>When the components are correlated, the off-diagonal entries of the matrix-valued covariance kernel can couple them, so solving a scalar equation for each component may not give the vector modes. For standard three-dimensional Brownian motion, the components are independent and $\mathbf{R}_{\mathbf{B}}(t,s)=\min(t,s)\mathbf{I}_3$, where $\mathbf{I}_3$ is the $3\times3$ identity matrix. The integral equation therefore decouples into three copies of the scalar Brownian motion equation.</p>
<p>Applying the eigenfunctions and eigenvalues in equations (20) and (21) to each component and grouping the coefficients gives</p>

\begin{align}
    \mathbf{B}(t) = \sum_{n=1}^{\infty} \frac{\sqrt{2}\sin(\pi(n-1/2)t)}{\pi (n-1/2)} \begin{bmatrix}
Z_{n,x} \\
Z_{n,y} \\
Z_{n,z}
\end{bmatrix} 
\end{align}
<p>where all $Z_{n,k} \sim \mathcal{N}(0,1)$ i.i.d., $k\in \{x,y,z\}$.</p>

<h2>Appendix: The covariance of Brownian motion</h2>
<p>Let $0\le s\le t\le1$. Standard Brownian motion has mean zero, so $R_B(t,s)=\mathbb{E}[B(t)B(s)]$. Its variance at time $s$ is $\mathrm{Var}(B(s))=s$. Write $B(t)=B(s)+[B(t)-B(s)]$. The increment $B(t)-B(s)$ is independent of $B(s)$ and has mean zero, so $\mathbb{E}[(B(t)-B(s))B(s)]=0$. Therefore</p>
<div>
\begin{equation}
\begin{aligned}
R_B(t,s)
&=\mathbb{E}[B(t)B(s)]\\
&=\mathbb{E}[B(s)^2] +\mathbb{E}[(B(t)-B(s))B(s)]\\
&=\operatorname{Var}(B(s))=s.
\end{aligned}
\end{equation}
</div>
<p>If instead $t\le s$, exchanging $t$ and $s$ gives $R_B(t,s)=t$. Thus, for either ordering,</p>
<div>
\begin{equation}
R_B(t,s)=\min(t,s).
\end{equation}
</div>
</div>
