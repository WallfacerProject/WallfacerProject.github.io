---
layout: distill
title: Kosambi–Karhunen–Loève Expansion
date: 2026-10-02 00:00:00
description:
tags: math
categories:
related_posts: false
---

<div class="kosambi-notes">
<p>Consider a second order mean-square continuous<d-footnote>i.e., $\mathbb{E}[X(t)^2] < \infty\quad\forall t$. We need this in order to define the variance of the coefficients. We also need $X(t)$ to be mean-square continuous, otherwise the integral equation would not have well defined eigenfunctions.</d-footnote> real-valued zero-mean stochastic process $X(t)$, $t\in[a,b]$. We want to express it in terms of an orthonormal basis of deterministic functions with zero-mean uncorrelated random coefficients:</p>

\begin{align}
    X(t) = \sum_{n=1}^{\infty} X_n \phi_n(t).
\end{align}
<p>We have</p>

\begin{align}
    X_n = \int_a^b X(t)\phi_n(t)\,\mathrm{d} t.
\end{align}
<p>From here it is obvious that $x_n$ is zero-mean (because $X(t)$ is zero-mean and we assumed it is nice enough to interchange the expectation operator with the integral). Now we want to see what it implies about the coefficients if we want them to be uncorrelated:</p>

\begin{align}
    \mathbb{E}[X_nX_m] &= \mathbb{E}\int_a^b X(t)\phi_n(t)\,\mathrm{d} t \int_a^b X(s)\phi_m(s)\,\mathrm{d} s\\
    &= \int_a^b\int_a^b \phi_n(t)\phi_m(s) \mathbb{E}[X(t)X(s)]\,\mathrm{d} t \,\mathrm{d} s\\
    &= \int_a^b\int_a^b \phi_n(t)\phi_m(s) R_X(t,s)\,\mathrm{d} t \,\mathrm{d} s.
\end{align}
<p>Because we would like the coefficients $X_n$ to be uncorrelated, the latter term should be of the form $\lambda_n\delta_{nm}$:</p>

\begin{align}
    \int_a^b\int_a^b \phi_n(t)\phi_m(s) R_X(t,s)\,\mathrm{d} t \,\mathrm{d} s &= \lambda_n\delta_{nm}\\
    \implies \int_a^b R_X(t,s) \phi_n(s)\,\mathrm{d} s &= \lambda_n \phi_n(t).
\end{align}
<p>Therefore, by solving this integral equation, we can find the orthonormal basis functions of the expansion. This equation implies that these basis functions are the eigenfunctions of the covariance operator of the process. Note that by putting $n=m$ we find $\mathbb{E}[X_n^2] = \mathrm{Var}[X_n] = \lambda_n$, i.e., the variances of the coefficients $X_n$ are equal to the eigenvalues of the covariance function. The second moment of $X_n$ is exactly the variance of $X_n$ because, again, these coefficients are zero-mean. Often people like to perform a sort of normalization by noting the following:</p>

\begin{align}
    \mathrm{Var}[X_n] &= \lambda_n\\
    \implies \frac{1}{\lambda_n}\mathrm{Var}[X_n] &= 1\\
    \implies \mathrm{Var}\left[\frac{X_n}{\sqrt{\lambda_n}}\right] &=1.
\end{align}
<p>Now set $X_n/\sqrt{\lambda_n} = Z_n$ or $X_n = \sqrt{\lambda_n} Z_n$. Then we can write the Kosambi expansion as</p>

\begin{align}
    X(t) = \sum_{n=1}^{\infty} \sqrt{\lambda_n}Z_n\phi_n(t)
\end{align}
<p>where now the random coefficients are zero-mean and unit-variance, scaled by the square roots of the eigenvalues of the covariance function $R_X(t,s)$. Suppose $X(t)$ met the assumptions above except it had non-zero mean $\mu_X(t)$. Then we could simply subtract off $\mu_X(t)$ and perform the procedure above on the “zero-meaned” process then add in the mean again at the end. We write this slightly more general version of the Kosambi expansion:</p>
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
<p>As an example, take $X(t) = B(t), t\in[0,1]$  the standard Brownian motion. This has covariance function $\min(t,s)$. Then we need to solve</p>

\begin{align}
    \int_0^1 \min(t,s)\phi_n(s)\,\mathrm{d} s = \lambda_n \phi_n(t).
\end{align}
<p>This is done by differentiating twice, putting $t=0$ and $t=T$, and enforcing normality of the eigenfunctions. This gives</p>

\begin{align}
    \phi_n(t) &= \sqrt{2} \sin(\pi (n-1/2)t)\\
    \sqrt{\lambda_n} &= \frac{1}{\pi\left(n-\frac{1}{2}\right)}\\
    \implies X(t) &= \sum_{n=1}^{\infty} Z_n\frac{\sqrt{2}}{\pi(n-1/2)} \sin(\pi(n-1/2)t)
\end{align}
<p>where $Z_n\sim \mathcal{N}(0,1)$.</p>
<p>Let's quickly do the complex vector version, which may be useful for electromagnetics. Consider the stochastic process $\mathbf{X}(\mathbf{r}): \Omega \subset \mathbb{R}^3 \to \mathbb{C}^3$. The Kosambi expansion is</p>

\begin{align}
    \mathbf{X}(\mathbf{r}) = \mu_X(\mathbf{r}) + \sum_{n=1}^{\infty} X_n \mathbf{\Phi}_n(\mathbf{r})
\end{align}
<p>where $\mathbf{\Phi}_n: \Omega \subset \mathbb{R}^3 \to \mathbb{C}^3$. Throughout the following we will use the inner product defined by</p>

\begin{align}
    \langle\mathbf{f},\mathbf{g}\rangle = \int_{\Omega} \mathbf{f}(\mathbf{r})^H\mathbf{g}(\mathbf{r})\,\mathrm{d}^3\mathbf{r}.
\end{align}
<p>This yields</p>

\begin{align}
    X_n = \int_{\Omega} \mathbf{\Phi}_n^H(\mathbf{r}) [\mathbf{X}(\mathbf{r}) - \mu_{\mathbf{X}}(\mathbf{r})]\,\mathrm{d}^3\mathbf{r}.
\end{align}
<p>Then</p>

\begin{align}
    \mathbb{E}[X_nX_m^*] = \mathbb{E}\int_{\Omega} \mathbf{\Phi}_n^H(\mathbf{r}) [\mathbf{X}(\mathbf{r}) - \mu_{\mathbf{X}}(\mathbf{r})]\,\mathrm{d}^3\mathbf{r}\int_{\Omega} [\mathbf{X}(\mathbf{s}) - \mu_{\mathbf{X}}(\mathbf{s})]^H \mathbf{\Phi}_m(\mathbf{s})\,\mathrm{d}^3\mathbf{s}
\end{align}
<p>where in the first line we used the identity $(\mathbf{a}^H \mathbf{b})^* = \mathbf{b}^H \mathbf{a}$. Then</p>

\begin{align}
    \mathbb{E}[X_nX_m^*] = \int_{\Omega}\int_{\Omega} \mathbf{\Phi}_n^H(\mathbf{r})\mathbf{R}_{\mathbf{X}}(\mathbf{r},\mathbf{s}) \mathbf{\Phi}_m(\mathbf{s})\,\mathrm{d}^3\mathbf{r}\,\mathrm{d}^3\mathbf{s}.
\end{align}
<p>We would like this to be equal to $\lambda_n\delta_{nm}$. This is true if the $\mathbf{\Phi}_n$ are eigenfunctions of the covariance function,</p>

\begin{align}
    \int_{\Omega} \mathbf{R}_{\mathbf{X}}(\mathbf{r},\mathbf{s}) \mathbf{\Phi}_n(\mathbf{s})\, \mathrm{d}^3\mathbf{s} = \lambda_n\mathbf{\Phi}_n(\mathbf{r}).
\end{align}
<p>We can normalize as before by making the substitution $X_n = \sqrt{\lambda_n} Z_n$, where $\mathbb{E}[Z_n] = 0$, $\mathbb{E}|Z_n|^2 = 1$. Then we have</p>

\begin{align}
    \mathbf{X}(\mathbf{r}) = \mu_X(\mathbf{r}) + \sum_{n=1}^{\infty} \sqrt{\lambda_n}Z_n \mathbf{\Phi}_n(\mathbf{r})
\end{align}
<p>We could also do a version of this where the vector-valued stochastic process is a function of time. Then the inner product changes accordingly. For the three-dimensional Brownian motion, for example, we have</p>

\begin{align}
    \mathbf{B}(t) = \sum_{n=1}^{\infty} \frac{\sqrt{2}\sin(\pi(n-1/2)t)}{\pi (n-1/2)} \begin{bmatrix}
Z_{n,x} \\
Z_{n,y} \\
Z_{n,z}
\end{bmatrix} 
\end{align}
<p>where all $Z_{n,k} \sim \mathcal{N}(0,1)$ i.i.d., $k\in \{x,y,z\}$.</p>
</div>
