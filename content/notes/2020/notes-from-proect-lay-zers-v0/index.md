---
title: Notes from project — lay-zers v0
date: 2020-05-26
---

I made a thing over the weekend; [lay-zers](https://lab.sransara.com/lay-zers): a "laser" playground for the imaginative.
Here I will try to compile my notes and retrospective thoughts for future reference.

<!--more-->

**TLDR**: 
- Pick a project that's been lingering in the mind for far too long
    - Produce the best effort output with in self allocated time → get feedback → iterate
    - Any rabbit hole ideas can be noted down and followed up later
- Have a plan on how to handle asymmetry of input events across different device types
- Write to gain clarity of thoughts
- [Pixi.js](https://github.com/pixijs/pixi.js) and [Typescript](https://www.typescriptlang.org) are cool

# Backstory
This last long weekend I sat down for a programming project with a personal challenge: start a project and see its way through to something usable by the end of weekend.
This is a trick to alleviate my tendency to chase down rabbit holes in personal projects.

> I love deadlines. I like the whooshing sound they make as they fly by.
>
> &mdash; Douglas Adams

I needed a stepping stone project idea to get the hang of some basics for a future project idea brewing in my mind. 
Coming in near future to a browser near you: A pixel playground to experiment with the water as electricity analogy ({{<ref-figure name="water-as-electricity">}}).

{{<figure
name="water-as-electricity"
src="water-as-electricity.png"
caption="Water as electricity analogy"
attr="[Sparkfun: Voltage, Current, Resistance, and Ohm's Law](https://learn.sparkfun.com/tutorials/voltage-current-resistance-and-ohms-law)">}}

Sounds cool? Yes! (to me at least). 
Well, back in the real wold I needed to set some goals for the weekend's stepping stone project.

- Have a finished deliverable by end of the weekend.
- Learn about 2D HTML5 canvas graphics and WebGL.
- Freshen up my vector knowledge.
- Get an idea how to design apps to be usable in variety of screen sizes and input controls.
- Try out Typescript (an intense battle of [Typescript](https://www.typescriptlang.org/) vs [Clojurescript](https://clojurescript.org/), Typescript won by context).
- And also to write this note.

With these goals in check, lay-zers was born.

# A laser playground for the imaginative: lay-zers

In [lay-zers](https://lab.sransara.com/lay-zers/), you get a canvas to plop down *layzers* and see how they interact with each other in an [additive color model](https://en.wikipedia.org/wiki/Additive_color) just like real lasers.

{{<figure
name="layzers-screenshot"
src="layzers-screenshot.png"
caption="lay-zers playground in action">}}

# Lessons learned along the way
By the end of the weekend I was able to get the *thing* out in to the world. 
At the end *it* was not about getting a *thing* out in the world. 
But *it* was about the lessons learned along the way.

## On planning and productivity
I saw a significant productivity boost as I was **working towards an idea or a set of goals with a strict deadline**.
This self-imposed constraint made a significant dent in my time spent on the usual *rabbit holes*:

- Researching prior art
- Is this best way to do it?
- Thinking about the best abstractions
- Imagining new features
- Any interesting problems in this space?
- and many more ...

We can spend *zero* time on this, or we can even spend *infinite* time on this. 
Either option is not ideal. 
Finding a middle ground depends on the context and can be a struggle.
It is a struggle because, of the push and pull between our need to release a quality output and the time constraint.

So the second takeaway for me here is to **release thy self from the need to produce the most perfect output**.

- Produce the best effort output with in self allocated time → get feedback → iterate
- Any rabbit hole ideas can be noted down and followed up later

I may have re-discovered a simple form of agile development method for personal projects.
Not sure how this mindset will pan out for a more serious project. 
But I'm excited to apply this for my future projects.

## On 2D canvas
As my focus is on 2D graphics, I picked the **[Pixi.js](https://github.com/pixijs/pixi.js) library to help me deal with the HTML5 Canvas and WebGL**.
I don't think I have any authority to make any absolute claims on this topic.
But I have a good impression of Pixi because it had good enough of everything that I needed for this project.
I think I will continue to use it for later projects.

- Easily navigable [documentation](https://pixijs.download/release/docs/index.html)
- Thorough [examples](https://pixijs.io/examples/)
- Typescript support
- Active help in the [HTML5 Game Devs forum](https://www.html5gamedevs.com/)
- Easily usable by a noob like me
- And some cool optimizations like [batch renderer](https://medium.com/swlh/inside-pixijs-batch-rendering-system-fad1b466c420) and [more](https://medium.com/swlh/inside-pixijss-high-performance-update-loop-856fb1d841a0)

## On cross device compatible app design
This was a hard nut to crack.
Props to those who work on GUI design day to day.

Here the takeaway for me was to **be mindful of the asymmetry of input events in different types of devices**.
Mouse inputs have hover, right-click and also mouse with keyboard combos.
Touch devices can support myriad different multi-touch gestures.
The [Web touch API](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) seems plenty versatile to support any gesture we can dream of.
Out of place interaction modes play a decisive role in the usability of an app.

This is an example where the deadline based time constraint stopped me from following another feature rabbit hole.
So for this project I short circuited all this complexity by only supporting left-click and single pointer on-touch events.

## On Typescript
**[Typescript](https://www.typescriptlang.org/) provided a significant quality of life improvement over plain old Javascript**.
It was especially helpful to get the plumbing to be done right in the first pass.

- Good editor tooling support for Typescript
- Built-in Typescript support in Pixi
- Minimal config web app bundling with [Parcel.js](https://parceljs.org/)

I wonder how this would have played out if I had picked Clojurescript. 
Probably the difference in programming paradigms will lead to different sets of pros and cons.
But I believe for this type of project Typescript was a better choice due to library support and imperative coding style.

## On writing about it
Although writing this note was a goal from the beginning, I had a tough time to convince my self that this measly project warrants a write-up.
At the end I ended up writing this note to hold my self accountable, but I am glad I did it.
It let me put down the thoughts, doubts and feelings that I had from this weekend challenge while the memories are fresh.

**Writing helps to bring clarity to my fleeting thoughts and ideas**.

Only while doing this write-up I realized a glaring bug in lay-zers.
See if you can notice something fishy in {{<ref-figure name="old-layzers-screenshot">}}.

{{<figure
name="old-layzers-screenshot"
src="old-layzers-screenshot.png"
caption="lay-zers with a glaring bug">}}

For a playground of lasers, the colors blends looks like paint mixing, not like light mixing.
This is because of different modes of color mixing: 

- [Additive color mixing](https://en.wikipedia.org/wiki/Additive_color) is how natural lights blend
- [Subtractive color mixing](https://en.wikipedia.org/wiki/Subtractive_color) is how colors blend in inks

Now that this bug is gone, you can have around 90% experience of a real laser playground in [lay-zers](https://lab.sransara.com/lay-zers/).

# Retrospective thoughts on lay-zers
>  The [playground](https://lab.sransara.com/lay-zers/) itself is very nonrestrictive and sans objectives. 
> *(1)* It's goal is to **inspire you to imagine your own game** out of *layzers*. 
> Once you are struck with an amazing game idea with layzers, then *(2)* this codebase should provide the code blocks necessary for **bringing life to your next hit game**. 
> The [main codebase](https://github.com/sransara/lay-zers/blob/master/src/main.ts) is extendible but straight forward with just the right amount of abstractions, if I say so myself. 
> *(3)* If nothing else, this project should serve as a an interesting [Pixi.js](https://www.pixijs.com/) demo.
>
> &mdash; [lay-zers README](https://github.com/sransara/lay-zers/blob/master/README.md)

A game is made interesting by the constraints introduced and objectives it poses.
Problem with lay-zers being a playground is that it lacks these two factors to make it interesting.
We can introduce a simple set of constraints and objectives like: using minimum needed emitting layzers make the color magenta.
And that itself makes the whole thing interesting.
I am just too lazy to work on taking layzers to the next level at the moment.
As the tag lines says: I've left the playground for the users's imagination to create their own puzzles.


# Conclusion
- Pick a project that's been lingering in the mind for far too long
    - Produce the best effort output with in self allocated time → get feedback → iterate
    - Any rabbit hole ideas can be noted down and followed up later
- Have a plan on how to handle asymmetry of input events across different device types
- Write to gain clarity of thoughts
- [Pixi.js](https://github.com/pixijs/pixi.js) and [Typescript](https://www.typescriptlang.org) are cool

All in all, I would say this weekend challenge was a success. 
Let's see how these lessons pan out for my upcoming projects.
