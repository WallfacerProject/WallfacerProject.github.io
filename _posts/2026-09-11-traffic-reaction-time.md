---
layout: distill
title: Traffic, Reaction Time, and Green Lights
date: 2026-9-11 05:40:16
description:
tags: math physics
categories:
related_posts: false
---

Growing up in the Bay Area, I have spent an unfortunate amount of time stuck in traffic. This has shaped my current views on cars, driving, and city planning. I might talk about this further in another post, but for now I will leave you with the trailer for the YouTube channel Not Just Bikes: [link](https://www.youtube.com/watch?v=OQE_5MFCekg). It should go without saying that I do not agree with everything he says, though there is certainly a lot I do agree with.

On one of my trips back to San Jose from New York, while sitting at a traffic light, I had the following question:

<div style="border: 2px solid black; padding: 10px; width: 100%; max-width: 700px; margin: 20px auto; text-align: center; box-sizing: border-box;">
    How does reaction time affect the number of cars that get through during a green light?
</div>

At some point (while not driving) I got around to formulating this mathematically and found a clean, simple formula, which is what this post is about. Here is the setup to our problem:

1. We observe one lane of traffic with an indefinite number of cars waiting in line.
1. Each car is identical and of length $L$ meters.
1. The light stays green for $T$ seconds.
1. There is no space between cars.
1. Each driver has a reaction time of $\tau$ seconds. The driver at the front reacts to the light turning green and each subsequent driver reacts to the car in front of them starting to move.
1. Each car moves at constant acceleration $a$ meters/second^2.
1. Let $x_0$ denote the initial position of the first car's front bumper. We say that car $n$ has made the light if its back bumper reaches $x_0$. Since there are no gaps between cars, this requires the car in the $n$th position to travel a distance of $nL$ meters within the $T$ seconds that the light is green.

We want to derive $N(\tau)$, the number of cars that pass through the intersection as a function of reaction time.

## Baseline model

### The train benchmark

Let's first consider the idealized scenario where each driver has a perfect reaction time, i.e., $\tau = 0$. Then the cars essentially form a train, accelerating synchronously as soon as the light turns green. How many cars will pass through in this case? It will simply be how far the train travels in $T$ seconds at constant acceleration $a$ divided by the length of each car, rounded down to the nearest integer:
\begin{equation}
    N_{\mathrm{train}} = \left\lfloor \frac{a T^2}{2L}\right\rfloor,
\end{equation}
where we obtained the distance traveled via kinematics. This gives us the upper bound on how many cars will pass through and it will be interesting to compare with the nonzero $\tau$ case which we derive now.

### Including reaction time

Observe that car $n$ gets through if the following condition is met: [total reaction time delay caused by the $(n-1)$ cars in front of car $n$ and its own reaction time delay] + [time $t$ it takes car $n$ to travel distance $nL$] $\leq T$. The first term is simply $(n-1)\tau + \tau = n\tau$. The second term is found via kinematics. We have
\begin{align}
nL &= \frac{1}{2}a t^2\newline
\implies t &= \sqrt{\frac{2nL}{a}}.
\end{align}
Putting things together, the mathematical condition for the $n$th car to pass through is given by
\begin{equation}
n\tau + \sqrt{\frac{2nL}{a}} \leq T.
\end{equation}
Let $m = \sqrt{n}$. Then we have
\begin{equation}
    \tau m^2 + \sqrt{\frac{2L}{a}} m - T \leq 0.
\end{equation}
We want to find the maximal $m$ that satisfies this inequality because its square will give the continuous threshold for $n$. Denote this maximal $m$ by $M(\tau)$. For $\tau>0$, using the quadratic formula and discarding the negative root gives
\begin{align}
    M(\tau) &= \frac{\sqrt{\frac{2L}{a} +4\tau T} - \sqrt{\frac{2L}{a}}}{2\tau}.
\end{align}
Squaring $M(\tau)$ gives the continuous throughput threshold. Let
\begin{equation}
    \widetilde{N}(\tau) = M(\tau)^2
    = \left(\frac{\sqrt{\frac{2L}{a} +4\tau T} - \sqrt{\frac{2L}{a}}}{2\tau}\right)^2.
\end{equation}
The actual number of cars must be an integer, so we round this threshold down:
\begin{equation}
    N(\tau) = \left\lfloor \widetilde{N}(\tau) \right\rfloor.
\end{equation}
As a sanity check, we would want to verify that the expression before rounding reduces to the train result when $\tau \to 0$. By using L'Hôpital's rule, we do indeed find that
\begin{equation}
\lim_{\tau\to 0} \widetilde{N}(\tau) = \frac{a T^2}{2L}.
\end{equation}
Therefore, at exactly $\tau=0$, we recover $N(0)=N_{\mathrm{train}}$ after applying the floor function.

As another sanity check, we can observe what happens if we allow the acceleration to increase without bound. We have
\begin{equation}
    \lim_{a\to\infty} \widetilde{N}(\tau) = \frac{T}{\tau}.
\end{equation}
Thus, in the idealized infinite-acceleration model, the integer throughput is $\left\lfloor T/\tau \right\rfloor$. This makes sense because with infinite acceleration, the only bottleneck for the number of cars getting through would be the length of the green light and each driver's reaction time.

Further, as expected, we have
\begin{equation}
    \lim_{\tau \to \infty} N(\tau) = 0.
\end{equation}
The limit tells us that the integer throughput eventually vanishes, while the following asymptotic relation describes how quickly the expression before rounding approaches zero:
\begin{equation}
\widetilde{N}(\tau) \sim \frac{T}{\tau}, \quad \tau \to \infty,
\end{equation}
where $\sim$ means that the ratio of the left-hand side to the right-hand side approaches one.

### Visualizing the uncapped model

[Figure 1](#fig-uncapped-throughput) shows the integer throughput as a function of reaction time for three green-light durations.

<div id="fig-uncapped-throughput" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/cars-through-light-vs-reaction-time.png?v=4" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Number of cars through the light versus driver reaction time for three green-light durations">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 1.</strong> $N(\tau)$ for $T=20,30,$ and $40\,\mathrm{s}$, with $L=5\,\mathrm{m}$ and $a=2\,\mathrm{m/s^2}$.</span>
</div>

Subtracting each curve in [Figure 1](#fig-uncapped-throughput) from its train benchmark gives the train advantage shown in [Figure 2](#fig-uncapped-advantage).

<div id="fig-uncapped-advantage" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/train-advantage-vs-reaction-time.png?v=4" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Train advantage versus driver reaction time for three green-light durations">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 2.</strong> The train advantage $N_{\mathrm{train}}-N(\tau)$ for $T=20,30,$ and $40\,\mathrm{s}$, with $L=5\,\mathrm{m}$ and $a=2\,\mathrm{m/s^2}$. The corresponding train throughputs are $80$, $180$, and $320$ cars.</span>
</div>

To factor out the different train throughputs, [Figure 3](#fig-uncapped-efficiency) shows the ratio $N(\tau)/N_{\mathrm{train}}$.

<div id="fig-uncapped-efficiency" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/relative-efficiency-vs-reaction-time.png?v=5" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Traffic throughput relative to train throughput versus driver reaction time">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 3.</strong> The relative efficiency $N(\tau)/N_{\mathrm{train}}$ for $L=5\,\mathrm{m}$, $a=2\,\mathrm{m/s^2}$, and $T=20\,\mathrm{s}$.</span>
</div>

Only the $T=20\,\mathrm{s}$ curve is shown in the relative efficiency plot because the curves for the other green-light durations have the same overall shape and would make the staircase plot harder to read. Their similarity does not mean that the efficiency is exactly independent of $T$. Dividing by $N_{\mathrm{train}}$ removes much of the change in scale, so the relative efficiency varies less dramatically than the absolute throughput over the range plotted. For sufficiently large $T$, however, the uncapped train throughput grows like $T^2$, while $\widetilde{N}(\tau)$ grows approximately like $T/\tau$ at fixed positive $\tau$. The uncapped relative efficiency must therefore eventually decrease as $T$ increases.

Several features stand out. The throughput is particularly sensitive to small reaction times because the delay accumulates down the line: car $n$ loses $n\tau$ seconds. For $T=20\,\mathrm{s}$, increasing the reaction time from zero to one second reduces the number of cars from $80$ to $12$, only $15\%$ of the ideal train throughput. As $\tau$ increases further, the curve flattens because the system is already dominated by reaction delay.

[Figures 4](#fig-uncapped-heatmap) and [5](#fig-uncapped-spacetime) give two complementary views of the same model: the first varies both $\tau$ and $T$, while the second follows individual cars through time.

<div id="fig-uncapped-heatmap" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/throughput-heatmap.png?v=3" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Heat map of traffic throughput across reaction time and green-light duration">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 4.</strong> The integer-valued throughput across reaction time $\tau$ and green-light duration $T$, with $L=5\,\mathrm{m}$ and $a=2\,\mathrm{m/s^2}$.</span>
</div>

<div id="fig-uncapped-spacetime" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/car-space-time-diagram.png?v=3" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Space-time trajectories of cars approaching the crossing line">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 5.</strong> A space-time diagram for $L=5\,\mathrm{m}$, $a=2\,\mathrm{m/s^2}$, $T=20\,\mathrm{s}$, and $\tau=1\,\mathrm{s}$. Each curve is a car's rear-bumper position: it stays flat until that driver reacts, then bends upward as the car accelerates. A car passes if its curve reaches $x=x_0$ before the green light ends. Car $12$ is the last to pass, while car $13$ is the first to miss.</span>
</div>

[Figure 4](#fig-uncapped-heatmap) shows how longer green lights increase the absolute throughput, while [Figure 5](#fig-uncapped-spacetime) makes the mechanism behind the reaction-time penalty visible. Each successive car remains stationary longer than the one ahead of it, producing a wave of delayed motion that propagates backward through the line. At fixed positive $\tau$, the continuous threshold eventually grows approximately like $T/\tau$, whereas the train result grows like $T^2$. The resulting gap is dramatic, but its size should not be interpreted as a realistic traffic-engineering prediction: it depends heavily on our assumption that the cars can accelerate indefinitely. Real cars have a maximum speed, so we turn to that extension next.

## Adding a maximum speed

### Motion of a speed-capped car

So far, each car has been allowed to accelerate forever. We now make the model more realistic by introducing a maximum speed $v_{\max}$. Let $t$ denote the time elapsed since a particular car begins moving. The car accelerates from rest at the constant acceleration $a$ until it reaches $v_{\max}$, then continues at that speed. The time required to reach the speed cap is
\begin{equation}
t_a = \frac{v_{\max}}{a}.
\end{equation}
The car's velocity is therefore
\begin{equation}
v(t) =
\begin{cases}
at, & 0 \leq t \leq t_a,\newline
v_{\max}, & t > t_a.
\end{cases}
\end{equation}
Integrating the velocity gives the distance traveled. Before the car reaches its maximum speed, we recover the usual constant-acceleration result. Afterward, we add the distance traveled during the acceleration phase to the distance traveled while cruising:
\begin{align}
d(t)
&=
\begin{cases}
\dfrac{1}{2}at^2, & 0 \leq t \leq t_a,\newline
\dfrac{1}{2}at_a^2 + v_{\max}(t-t_a), & t > t_a
\end{cases}\newline
&=
\begin{cases}
\dfrac{1}{2}at^2, & 0 \leq t \leq \dfrac{v_{\max}}{a},\newline
v_{\max}t-\dfrac{v_{\max}^2}{2a}, & t > \dfrac{v_{\max}}{a}.
\end{cases}
\end{align}
Car $n$ begins moving at time $n\tau$, so it has $T-n\tau$ seconds to move before the light changes. Its rear bumper must travel $nL$, giving the condition
\begin{equation}
d(T-n\tau) \geq nL.
\end{equation}

### Throughput with a speed cap

To solve this condition analytically, let $t_n$ denote the time that car $n$ must spend moving before its rear bumper reaches $x_0$. In other words, $d(t_n)=nL$. The distance traveled by the time the car first reaches $v_{\max}$ is
\begin{equation}
d_a = \frac{v_{\max}^2}{2a}.
\end{equation}
If $nL \leq d_a$, the car reaches $x_0$ while it is still accelerating, so
\begin{equation}
t_n = \sqrt{\frac{2nL}{a}}.
\end{equation}
If $nL>d_a$, the car first accelerates for $t_a$ seconds and then travels the remaining distance $nL-d_a$ at $v_{\max}$. Therefore,
\begin{align}
t_n
&=t_a+\frac{nL-d_a}{v_{\max}}\newline
&=\frac{nL}{v_{\max}}+\frac{v_{\max}}{2a}.
\end{align}
Combining the two regimes gives
\begin{equation}
t_n =
\begin{cases}
\sqrt{\dfrac{2nL}{a}}, & nL \leq \dfrac{v_{\max}^2}{2a},\newline
\dfrac{nL}{v_{\max}}+\dfrac{v_{\max}}{2a}, & nL > \dfrac{v_{\max}^2}{2a}.
\end{cases}
\end{equation}
Since the accumulated reaction delay is $n\tau$, car $n$ clears the light precisely when
\begin{equation}
n\tau+t_n \leq T.
\end{equation}

We can now solve for the largest car index. Define
\begin{equation}
n_a = \frac{d_a}{L} = \frac{v_{\max}^2}{2aL}.
\end{equation}
Here $n_a$ is the continuous car index whose required travel distance $n_aL$ is exactly the acceleration distance $d_a$. It need not be an integer. The cutoff between the two regimes occurs when this car has exactly enough time to clear the light. Since it begins moving at time $n_a\tau$ and reaches $x_0$ after accelerating for $t_a$ seconds, the corresponding green-light duration is
\begin{equation}
T_c = n_a\tau+t_a
= \frac{\tau v_{\max}^2}{2aL}+\frac{v_{\max}}{a}.
\end{equation}

Let $n^{\ast}(\tau)$ denote the largest continuous car index that satisfies the crossing condition, before applying the floor function. We obtain
\begin{equation}
n^{\ast}(\tau)=
\begin{cases}
\left(\dfrac{\sqrt{\frac{2L}{a}+4\tau T}-\sqrt{\frac{2L}{a}}}{2\tau}\right)^2,
& T \leq T_c,\newline
\dfrac{T-\frac{v_{\max}}{2a}}{\tau+\frac{L}{v_{\max}}},
& T>T_c.
\end{cases}
\end{equation}
When $\tau=0$ and the first branch applies, its expression is understood through its limit. The maximum speed throughput is
\begin{equation}
N_{\mathrm{cap}}(\tau)=\left\lfloor n^{\ast}(\tau)\right\rfloor.
\end{equation}

The first branch is exactly our original answer. In this regime, the final car to clear the light reaches $x_0$ before reaching $v_{\max}$, so the speed cap never affects the motion relevant to the count. In the second regime, car $n$ reaches $x_0$ at time
\begin{equation}
C_n=n\tau+t_n
=n\left(\tau+\frac{L}{v_{\max}}\right)+\frac{v_{\max}}{2a}.
\end{equation}
The crossing times of two consecutive cars therefore differ by
\begin{equation}
C_{n+1}-C_n=\tau+\frac{L}{v_{\max}}.
\end{equation}
The next car begins moving $\tau$ seconds later and starts one additional car length from $x_0$, requiring another $L/v_{\max}$ seconds of cruising. The acceleration term is the same for both cars and cancels in the difference.

### The capped train benchmark

For the train, every car begins moving at the same time. If $T\leq t_a=v_{\max}/a$, the train accelerates throughout the green light and travels $aT^2/2$, as before. If $T>t_a$, it first travels
\begin{equation}
d_a=\frac{1}{2}at_a^2=\frac{v_{\max}^2}{2a}
\end{equation}
while accelerating. It then cruises at $v_{\max}$ for the remaining $T-t_a$ seconds. Its total distance in the second regime is therefore
\begin{align}
d_{\mathrm{train}}(T)
&=d_a+v_{\max}(T-t_a)\newline
&=\frac{v_{\max}^2}{2a}
+v_{\max}\left(T-\frac{v_{\max}}{a}\right)\newline
&=v_{\max}T-\frac{v_{\max}^2}{2a}.
\end{align}
Dividing the distance traveled by $L$ and rounding down gives
\begin{equation}
N_{\mathrm{train,cap}}
=
\begin{cases}
\left\lfloor\dfrac{aT^2}{2L}\right\rfloor,
& T \leq \dfrac{v_{\max}}{a},\newline
\left\lfloor\dfrac{v_{\max}T-\frac{v_{\max}^2}{2a}}{L}\right\rfloor,
& T>\dfrac{v_{\max}}{a}.
\end{cases}
\end{equation}
Setting $\tau=0$ in the car model therefore reproduces the capped-speed train result, just as it did in the original model.

### Visualizing the capped model

The resulting capped throughput is shown in [Figure 6](#fig-capped-throughput) for three green-light durations.

<div id="fig-capped-throughput" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/capped-throughput-vs-reaction-time.png?v=1" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Speed-capped traffic throughput versus driver reaction time for three green-light durations">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 6.</strong> $N_{\mathrm{cap}}(\tau)$ for $T=20,30,$ and $40\,\mathrm{s}$, with $L=5\,\mathrm{m}$, $a=2\,\mathrm{m/s^2}$, and $v_{\max}=15\,\mathrm{m/s}$.</span>
</div>

[Figure 7](#fig-capped-comparison) compares the capped result with the original unlimited-acceleration model.

<div id="fig-capped-comparison" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/capped-vs-uncapped-throughput.png?v=2" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Capped and uncapped traffic throughput versus driver reaction time">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 7.</strong> The integer-valued capped and uncapped throughputs for $L=5\,\mathrm{m}$, $a=2\,\mathrm{m/s^2}$, $v_{\max}=15\,\mathrm{m/s}$, and $T=20\,\mathrm{s}$. Once the curves coincide, the final car through the light never reaches the speed cap, so the original model applies unchanged.</span>
</div>

Subtracting the capped car count from the capped train benchmark gives the train advantage in [Figure 8](#fig-capped-advantage).

<div id="fig-capped-advantage" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/capped-train-advantage.png?v=3" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Capped-speed train advantage versus driver reaction time for three green-light durations">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 8.</strong> The capped-speed train advantage $N_{\mathrm{train,cap}}-N_{\mathrm{cap}}(\tau)$ for $T=20,30,$ and $40\,\mathrm{s}$, with $L=5\,\mathrm{m}$, $a=2\,\mathrm{m/s^2}$, and $v_{\max}=15\,\mathrm{m/s}$. The corresponding capped train throughputs are $48$, $78$, and $108$ cars.</span>
</div>

[Figure 9](#fig-capped-efficiency) divides the car count by the capped train count to show the relative efficiency.

<div id="fig-capped-efficiency" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/capped-relative-efficiency.png?v=4" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Capped traffic throughput relative to capped train throughput versus driver reaction time">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 9.</strong> The relative efficiency $N_{\mathrm{cap}}(\tau)/N_{\mathrm{train,cap}}$ for $L=5\,\mathrm{m}$, $a=2\,\mathrm{m/s^2}$, $v_{\max}=15\,\mathrm{m/s}$, and $T=20\,\mathrm{s}$.</span>
</div>

Here too, only the $T=20\,\mathrm{s}$ efficiency curve is shown because the curves for $T=30$ and $40\,\mathrm{s}$ nearly overlap it. In the capped model, this overlap has a direct explanation. Once the cars and train spend most of the green light at $v_{\max}$, both throughputs grow linearly with $T$. Increasing the green-light duration can then add many cars to the absolute count without changing their relative efficiency very much.

For example, when $T=20\,\mathrm{s}$ and $\tau=1\,\mathrm{s}$, $12$ cars clear the light compared with $48$ train cars. The speed cap lowers the ideal train benchmark from $80$ cars in the uncapped model to $48$, but the accumulated reaction delays still reduce the line to one quarter of that benchmark.

Finally, for a sufficiently long green light, both the car line and the train spend most of their time traveling at $v_{\max}$. Ignoring the negligible effect of the floor function on the leading-order behavior, their throughputs satisfy
\begin{align}
n^{\ast}(\tau) &\sim \frac{T}{\tau+L/v_{\max}},\newline
N_{\mathrm{train,cap}} &\sim \frac{v_{\max}T}{L}.
\end{align}
Since the floor function changes each continuous count by less than one, it does not affect the limiting ratio. Consequently, the relative efficiency of the actual integer throughputs satisfies
\begin{equation}
\lim_{T\to\infty}
\frac{N_{\mathrm{cap}}(\tau)}{N_{\mathrm{train,cap}}}
=\frac{L}{L+v_{\max}\tau}.
\end{equation}
Unlike the unlimited-acceleration model, both throughputs now grow linearly with $T$.

### Heat map and space-time diagram

[Figures 10](#fig-capped-heatmap) and [11](#fig-capped-spacetime) show how the capped model changes across parameter values and along individual vehicle trajectories.

<div id="fig-capped-heatmap" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/capped-throughput-heatmap.png?v=4" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Heat map of capped traffic throughput across reaction time and green-light duration">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 10.</strong> The integer-valued capped throughput across reaction time $\tau$ and green-light duration $T$, with $L=5\,\mathrm{m}$, $a=2\,\mathrm{m/s^2}$, and $v_{\max}=15\,\mathrm{m/s}$.</span>
</div>

<div id="fig-capped-spacetime" class="row mt-3 justify-content-center">
    <div class="col-sm mt-3 mt-md-0 d-flex justify-content-center" style="max-width: 760px;">
        <img src="/assets/img/traffic-reaction-time/capped-space-time-diagram.png?v=2" class="rounded z-depth-1" style="width: 100%; height: auto;" alt="Space-time trajectories of speed-capped cars approaching the crossing line">
    </div>
</div>
<div class="caption">
    <span><strong>Figure 11.</strong> A capped-speed space-time diagram for $L=5\,\mathrm{m}$, $a=2\,\mathrm{m/s^2}$, $v_{\max}=15\,\mathrm{m/s}$, $T=30\,\mathrm{s}$, and $\tau=1\,\mathrm{s}$. Each trajectory is initially curved while the car accelerates and becomes straight after it reaches $v_{\max}$. Car $19$ is the last to pass, while car $20$ is the first to miss.</span>
</div>

The heat map in [Figure 10](#fig-capped-heatmap) shows that longer green lights produce much larger absolute gains when reaction times are small. As $\tau$ increases, accumulated reaction delay becomes the dominant bottleneck, so adding the same number of seconds to $T$ allows fewer additional cars through. The space-time diagram in [Figure 11](#fig-capped-spacetime) makes the transition to cruising visible car by car: unlike the parabolic trajectories in the uncapped model, each path eventually straightens once its slope reaches $v_{\max}$. The maximum speed extension therefore preserves the clean zero reaction time correspondence while giving the long green light behavior a more realistic interpretation.

## Conclusion

Reaction time accumulates down the queue, so the $n$th car loses $n\tau$ seconds before it begins moving. Treating the cars as a train removes this backward propagating delay, which explains both the train's throughput advantage and the exact correspondence obtained when $\tau=0$. The uncapped speed model makes this mechanism especially transparent, while the capped speed extension gives the long green light behavior a more realistic structure. In its cruising regime, each additional car effectively costs $\tau+L/v_{\max}$ seconds, and the relative efficiency approaches the finite limit $L/(L+v_{\max}\tau)$.

We have assumed that every driver has the same deterministic reaction time $\tau$. A natural stochastic extension would assign driver $k$ a random reaction time $R_k$, making the accumulated delay through car $n$ the random sum $S_n=\sum_{k=1}^n R_k$. The number of cars that clear the light would then be a random first-passage quantity rather than a single deterministic count. Its distribution could reveal the variability and tail risk in traffic throughput and show how correlations between drivers change the likelihood of an unusually good or bad cycle.
