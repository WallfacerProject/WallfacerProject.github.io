---
layout: post
title: My Favorite Derivation of the Cauchy-Schwarz Inequality
date: 2024-12-11 05:40:16
description: 
tags: 
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

Let $\mathbf{v,w} \in V$, an inner product space. Consider the quadratic polynomial defined as the inner product of the vector $\mathbf{v} + t\mathbf{w}$ with itself over $t \in \mathbb{R}$\begin{align}
        p(t) = \braket{\mathbf{v} + t\mathbf{w}, \mathbf{v} + t\mathbf{w}}.
    \end{align}
    Since $p(t) \geq 0$, its discriminant must be nonpositive. This yields the Cauchy-Schwarz inequality.