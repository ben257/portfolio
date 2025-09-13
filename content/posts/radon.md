---
title: "Radon Activity Competition"
date: 2025-06-22
draft: false
tags: ["recsys", "SVD", "stacking", "collaborative filtering"]
math: true
---

# Data Set Overview
The data set comes from [tensorflow](https://www.tensorflow.org/datasets/catalog/radon). 

The goal of the competition was to predict radon activity, measured in pCi/L. Each observation in the data set is from a house. Key variables include floor which the measurement was taken, whether the house has a basement, and soil uranium level.
Latitude and longitude of the house are also given.

A key problem was encoding radon hotspots. If one location had an extreme amount of radon, it was likely that nearby locations also had high radon levels. In order to encode these hotspots, there were a few approaches to consider. First, you could create an indicator variable for zip code if an observation was in the same zip code as a hotspot. The same could also be done for county. However, these are indicator variables, and by using a hard threshold, the magnitude of radon activity is lost. Moreover, counties and zip codes may differ vastly in size and shape, and didn't seem to be the natural way to encode hotspots. For example, a hotspot on the edge of a zipcode would only count toward its own zip code, and not the immediately adjacent zip code.

  A more natural representation seemed to involve kernel density. Each observation would contribute to the calculation, and so there was no issue with thresholding or sparseness. Using notation, kernel density is calculated as:

$\hat{f}\_h(x) = \frac{1}{n h} \sum\_{i=1}^{n} K\left( \frac{x - x\_i}{h} \right)$

  where $K$ is the kernel function, $n$ is the number of data points, and $h$ is the bandwidth, a hyperparameter.

Smaller bandwith captured local radon activity very well.
<br>
<img src="/images/small_bandwith.png" alt="alt text" width="400">
 
  Larger bandwidths captured more global patterns.
    <br>
    <img src="/images/larger_bandwith.png" alt="alt text" width="400">

Another idea that was experimented with was encoding location with an embedding. The sentence embedding model paraphrase-MiniLM-L6-v2 was used, and was applied to the county,state of a location. 
  When visualizing the embeddings, we did notice that the embeddings did seem to convey geographical meaning. For example, the Minnesota and Missouri counties in their own separate groups. However, including this feature ultimately did not improve model performance.
<br>
<img src="/images/county_embedding.png" alt="alt text" width="400">



<script>
window.MathJax = {
  tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
  svg: { fontCache: 'global' }
};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>