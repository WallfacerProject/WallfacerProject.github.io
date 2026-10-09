---
layout: distill
title: My Favorite Derivation of the Cauchy-Schwarz Inequality
date: 2026-9-4 05:40:16
# date: 2026-6-26 05:40:16
description: Short and sweet.
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

Let <d-math>\mathbf{v,w} \in V</d-math>, a real inner product space. Consider the quadratic polynomial <d-math>p(t)</d-math> defined as the inner product of the vector <d-math>\mathbf{v} + t\mathbf{w}</d-math> with itself over <d-math>t \in \mathbb{R}</d-math>:

\begin{equation}
p(t) = \braket{\mathbf{v} + t\mathbf{w}, \mathbf{v} + t\mathbf{w}}.
\end{equation}

Since <d-math>p(t) \geq 0</d-math>, its discriminant must be nonpositive. This yields the Cauchy-Schwarz inequality:
\begin{align}
p(t) &= t^2 \lVert \mathbf{w} \rVert^2 + 2t \braket{\mathbf{v}, \mathbf{w}} + \lVert \mathbf{v}\rVert^2 \newline
\implies \Delta(p(t)) &= 4\braket{\mathbf{v}, \mathbf{w}}^2 - 4 \lVert \mathbf{v} \rVert^2\lVert \mathbf{w} \rVert^2 \leq 0 \newline
\implies \|\braket{\mathbf{v}, \mathbf{w}}\| &\leq \lVert \mathbf{v} \rVert\lVert \mathbf{w} \rVert.
\end{align}

I found this derivation in an excellent book on this and other inequalities titled <em>The Cauchy-Schwarz Master Class: An Introduction to the Art of Mathematical Inequalities</em> by John Michael Steele.
