---
title: "SuperCollider procedural programming"
description: "SuperColliderで初歩のサウンドプログラミング"
date: "12/31/2024"
draft: false
---

SuperColliderで音響プログラミングをしていこうという回  
SuperColliderの基本的な解説はここではなしないが、そのうちしたいと思います。  
まずはサイン波から生成していこう  

```js
SinOsc.ar(440.0)!2 * Line.kr(1, 0, 1.0);
```
音はなっただろうか。Cmnd + . で音は消せる。  
さらにこれをSynthDefに書き換えると  

```js
(
SynthDef(\sine, {
	a = SinOsc.ar(440.0)!2 * Line.kr(1, 0, 1.0);
	Out.ar(0, a);
}).add;
)

Synth(\sine);
```

以上はSuperColliderのシンセの基本とも言えるが、これをプログラミングの力で拡張していきたいと思う。  
まずはfor loopを使ってシンセを複製してみよう。  

```js
(
SynthDef(\sine, {
	a = SinOsc.ar(440.0)!2 * Line.kr(1, 0, 1.0);
	Out.ar(0, a);
}).add;
)

(
Routine{
	5.do{
		Synth(\sine);
		1.wait;
	};
}.play
)
```

これをさらに面白くするために発音ごとにランダムな周波数で鳴るように書き換えてみたい  

```js
(
SynthDef(\sine, {
	a = SinOsc.ar(Rand.new(100, 1000))!2 * Line.kr(1, 0, 1.0);
	Out.ar(0, a);
}).add;
)

Synth(\sine);

(
Routine{
	5.do{
		Synth(\sine);
		1.wait;
	};
}.play
)
```