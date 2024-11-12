---
title: "BLIT Band Limited Saw (gen in Max)"
description: "基本的なオシレーターをMax/MSPのgenで作成します。"
date: "12/31/2024"
draft: false
---

アンチエイリアスなしのPhasor Wave  
パーツ毎に見ていきます  
  
コードの全体像
```jsx
History cps, period;
History phase;
History num_partials;
History rolloff, partial_rolloff;
Param amp_at_nyquist(0.5, min=0, max=0.9999);
History lpa, lpb;
History lpx1, lpy1;
smoothing = 0.0001;

if(phase >= 1 || cps == 0) {
	phase = phase - 1;
	freq = in1;
	cps = clip(freq/samplerate, 0.001, 0.5);
	period = 1/cps;
	P2 = period/2;
	num_partials = 1 + floor(P2);
	rolloff = pow(amp_at_nyquist, 1/P2);
	partial_rolloff = pow(rolloff, num_partials);
}

beta = twopi * phase;
beta_n = num_partials * beta;
cosbeta = cos(beta);

n = 1 - partial_rolloff * cos(beta_n) - rolloff * 
	(cosbeta - partial_rolloff * cos(beta_n - beta));
d = period * (1 + rolloff * (-2 * cosbeta + rolloff));
x = n / d - cps;

omega = atan(pi * smoothing);
lpa = -(1-omega)/(1+omega);
lpb = (1-lpb)/2;
y = lpb * (x + lpx1) - lpa * lpy1;
lpx1 = x;
lpy1 = y;
out1 = y * -pi;
phase = phase + cps;
```

パラメーターの宣言
```js
History cps, period;
History phase;
History num_partials;
History rolloff, partial_rolloff;
Param amp_at_nyquist(0.5, min=0, max=0.9999);
History lpa, lpb;
History lpx1, lpy1;
smoothing = 0.0001;
```

位相をサンプル毎にどれだけ足すのかを計算する
```js
if(phase >= 1 || cps == 0) {
	phase = phase - 1;
	freq = in1;
	cps = clip(freq/samplerate, 0.001, 0.5);
	period = 1/cps;
	P2 = period/2;
	num_partials = 1 + floor(P2);
	rolloff = pow(amp_at_nyquist, 1/P2);
	partial_rolloff = pow(rolloff, num_partials);
}
```

一番重要な計算  
コサイン波を２つ使っているのが分かります
```js
beta = twopi * phase;
beta_n = num_partials * beta;
cosbeta = cos(beta);

n = 1 - partial_rolloff * cos(beta_n) - rolloff * 
	(cosbeta - partial_rolloff * cos(beta_n - beta));
d = period * (1 + rolloff * (-2 * cosbeta + rolloff));
```

**ローパスフィルター**  
スペクトラムで見ると、よく見るノコギリ波の形になります
```js
omega = atan(pi * smoothing);
lpa = -(1-omega)/(1+omega);
lpb = (1-lpb)/2;
y = lpb * (x + lpx1) - lpa * lpy1;
lpx1 = x;
lpy1 = y;
out1 = y * -pi;
phase = phase + cps;
```

という風に作られています。  
musicDSPも参考になります。  
[music DSP - Bandlimited sawtooth synthesis](https://www.musicdsp.org/en/latest/Synthesis/90-bandlimited-sawtooth-synthesis.html)