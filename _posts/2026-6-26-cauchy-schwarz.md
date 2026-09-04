---
layout: distill
title: My Favorite Derivation of the Cauchy-Schwarz Inequality
date: 2026-9-4 05:40:16
# date: 2026-6-26 05:40:16
description: 
tags: math
categories: 
related_posts: false
---
<!-- > We do not grow absolutely, chronologically. We grow sometimes in one dimension, and not in another, unevenly. We grow partially. We are relative. We are mature in one realm, childish in another.
> —Anais Nin -->
<style>
  blockquote footer {
    display: block;
    font-size: 0.9em;
    text-align: left;
  }
  blockquote p {
    margin-bottom: 1em; /* Space between paragraphs */
  }
</style>

Let $\mathbf{v,w} \in V$, a real inner product space. Consider the quadratic polynomial defined as the inner product of the vector $\mathbf{v} + t\mathbf{w}$ with itself over $t \in \mathbb{R}$

\begin{equation}
p(t) = \braket{\mathbf{v} + t\mathbf{w}, \mathbf{v} + t\mathbf{w}}.
\end{equation}

Since $p(t) \geq 0$, its discriminant must be nonpositive. This yields the Cauchy-Schwarz inequality:
\begin{align}
p(t) &= t^2 \lVert \mathbf{w} \rVert^2 + 2t \braket{\mathbf{v}, \mathbf{w}} + \lVert \mathbf{v}\rVert^2 \newline
\implies \Delta(p(t)) &= 4\braket{\mathbf{v}, \mathbf{w}}^2 - 4 \lVert \mathbf{v} \rVert^2\lVert \mathbf{w} \rVert^2 \leq 0 \newline
\implies \|\braket{\mathbf{v}, \mathbf{w}}\| &\leq \lVert \mathbf{v} \rVert\lVert \mathbf{w} \rVert.
\end{align}

I found this derivation in an excellent book on this and other inequalities titled <em>The Cauchy-Schwarz Master Class: An Introduction to the Art of Mathematical Inequalities</em> by John Michael Steele.
