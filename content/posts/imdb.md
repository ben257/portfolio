---
title: "IMBD Sentiment Classification"
date: 2025-06-22
draft: false
tags: ["TF-IDF", "SVD", "stacking", "collaborative filtering"]
math: true
---

### Data Set Overview
The IMDB dataset is a data set for binary sentiment classification. It has 50K movie reviews, with 25,000 movie reviews for training and 25,000 for testing.

I performed TF-IDF and then perform sentiment classification using the obtained features. We also compare the results to a pretrained Bert model, and then finetune Bert.

### TD-IDF
After performing tokenization, we apply TF-IDF to the corpus. TF-IDF is a measure of the importance of a word in a document, adjusted for its importance across the corpus. TF-IDF is the product of two statistics: term frequency and inverse document frequency. Term frequency is defined as is the relative frequency of term t within document d: 

$\text{tf}(t,d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}$

Inverse document frequency is a measure of how common or rare a word is across all documents. It is defined as $\mathrm {idf} (t,D)=\log {\frac {N}{n_{t}}}$

TF-IDF is the product of the term frequency and inverse document frequency: $\mathrm{tfidf}(t, d, D) = \mathrm{tf}(t, d) \cdot \mathrm{idf}(t, D)$. A word has high TF-IDF value if it is has high frequency in a document but is relatively unusual across the corpus.

### TF-IDF Applied to Data Set
When performing TF-IDF on the corpus, with the top 1000 words, we obtain the transformed numerical data set, with each row corresponding to a review, and each feature giving the TF-IDF value. 

When applying PCA to visualize the data in two dimensions, the sentiments overlap, but there is some separation, with positive sentiment reviews tend to be towards the bottom right of the plot, while negative sentiment reviews tend to be towards the upper left.

<br>
<img src="/images/td_idf_pca.png" alt="alt text" width="700">
<br>
To see tokens that are opposites to each other, we perform PCA on the transposed TD-IDF matrix, where the observations are the words, and the feature vector is the prominence in the documents. We obtain a 2-dimensional representation which we visualize.

<br>
<img src="/images/td_idf_pca_transpose.png" alt="alt text" width="700">
<br>
We see that there are several clusters of similar words, for example 
- man, woman, father, husband, and mother
- excellent, great, best
- worst, bad, waste, crap, horrible

Moreoover, worst, bad, waste, crap, horrible are on the opposite side of the space from excellent, great, best. 

We also use the cosine similarity to identify most similar and least similar words. We see that the least similar words to "best" are "bad","waste", and "horrible". The most similar words to "best" include "great","excellent","amazing", and "perfect".

<br>
<img src="/images/similar_best.png" alt="alt text" height="400">
<img src="/images/opposite_best.png" alt="alt text" height="400">
<br>

### Model Results

The TD-IDF feature matrix can be used to obtain 85% accuracy with logistic regression on the test set.

With "distilbert-base-uncased-finetuned-sst-2-english" achieves 89.06% accuracy.

Fine tuning the classification head for 3 epochs achieves 90.84% accuracy.	









<script>
window.MathJax = {
  tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
  svg: { fontCache: 'global' }
};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>