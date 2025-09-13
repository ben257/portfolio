---
title: "Netflix Prize Subsample Competition: SVD + Meta-Learner"
date: 2025-06-22
draft: false
tags: ["recsys", "SVD", "stacking", "collaborative filtering"]
math: true
---

# Data Set Overview
The Netflix Prize was an open competition hosted by Netflix from 2006 to 2009. The problem was to predict a rating of a user for a movie, an example of *collaborative filtering*. 

In the data set used (a sample of the Netflix Prize data set), 85% of user-movie ratings were missing. Ratings were integers between 1 and 5. An additional data set with movie meta data is also used. The test set contained 20,000 user-movie pairs, and the data set contained 7 millon known user-movie rating pairs. There were 400 unique movies and 100k unique users. The evaluation metric was accuracy score.

My solution to the competition scored second place in a team-based competition. My approach is outlined below:

# Approach:

### Part 1 (Truncated SVD)

The data set was first split into a training and validation set using an 80-20 split. A stratified sample was used, on the movie rating, due to imbalanced ratings, with 3's and 4's being far more common than 1's, 2's and 5's. 

Truncated SVD was then used iteratively to impute the matrix of user-movie ratings. 

In SVD, an $m \times n$ matrix $M$ is factorized in the form $M=U 	\Sigma V^*$, where $U$ is a $m \times m$ unitary matrix, $\Sigma$ is a $m \times n$ diagonal matrix with non-negative entries, and $V$ is a $n \times n$ unitary matrix. The diagonal entries of $\Sigma$ are called the singular values of $M$. In our case, the matrix being decomposed is the matrix of user-movie reviews, where $m$ is the number of users, and $n$ is the number of movies.

In truncated SVD, only the first $k$ singular values and corresponding components are kept. SVD is performed, and then the smallest singular values are set to 0. This $k$ is a hyperparameter that is needed to be tuned. Smaller values of $k$ give greater regularization, while larger values of $k$ allow a closer version of the original review matrix to be reconstructed.

Now, in SVD, each element of the matrix is assumed to be known. However, in our movie review matrix, most entries are missing. Therefore, in order to use SVD, we need to impute these missing values. To impute a missing user's movie rating, we took into account global, user, and movie effects.

To impute $R_{u,m}$, the rating for user $u$ and movie $m$, we calculated the following quantities: $\mu$, the average rating across all known user-movie pairs; $\mu_u$, the average rating for user $u$; and $\mu_m$, the average rating for movie $m$. The global effect was $\mu$; the user effect was $\mu_u - \mu$; the movie effect was $\mu_m - \mu$. Summing the three effects yielded $\tilde{R}{u,m} = \mu + (\mu_u - \mu) + (\mu_m - \mu) = \mu_u + \mu_m - \mu$.
    
Truncated SVD was performed using early stopping to halt the training when accuracy on the validation set leveled off. At each iteration, the movie-review matrix was decomposed into the three SVD matrices, and then reconstructed. The known movie-rating entries of the reconstructed matrix were then replaced with the true entries.

Grid search was used to determine the optimal number of singular values $k$.

### Part 2 (Meta Learner)

Now, SVD is only able to take into account the matrix of user-movie ratings. But there was other information which was not yet being used: movie meta data. For each movie, there was information about the language, genre, and the number of reviews. We could also take advantage of user meta data, including the number of reviews given, as well as the average review.

A new data set was constructed concatenating the user/movie meta data with the latent vectors from the SVD step. This data set was in tabular format, where each observation corresponded to a known user-movie rating pair. With this tabular format, a traditional machine learning model could be used. LightGBM was used, and trained on half of the SVD validation set, with the other half being used for validation of the meta learner. Hyperparameters were selected with Bayesian optimization for `n_estimators`, `learning_rate`, `max_depth`, and `colsample_bytree`. The meta learner improved validation accuracy by 2% over the SVD model, a significant improvement.


### References

1. Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. *Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining*, 785–794. https://doi.org/10.1145/2939672.2939785

2. Funk, S. (2006, December 11). Netflix update: Try this at home. *Simon Funk's Journal*. https://sifter.org/~simon/journal/20061211.html

3. Géron, A. (2019). *Hands-on machine learning with Scikit-Learn, Keras, and TensorFlow* (2nd ed.). O'Reilly Media.

4. Ke, G., Meng, Q., Finley, T., Wang, T., Chen, W., Ma, W., Ye, Q., & Liu, T.-Y. (2017). LightGBM: A highly efficient gradient boosting decision tree. *Advances in Neural Information Processing Systems*, *30*. https://papers.nips.cc/paper/6907-lightgbm-a-highly-efficient-gradient-boosting-decision-tree

5. OpenAI. (2023). *ChatGPT (GPT-4)* [Large language model]. https://openai.com/chatgpt

6. Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., Blondel, M., Prettenhofer, P., Weiss, R., Dubourg, V., Vanderplas, J., Passos, A., Cournapeau, D., Brucher, M., Perrot, M., & Duchesnay, E. (2011). Scikit-learn: Machine learning in Python. *Journal of Machine Learning Research*, *12*, 2825–2830. https://www.jmlr.org/papers/v12/pedregosa11a.html

7. *Scikit-learn.cluster.KMeans*. (n.d.). Scikit-learn. https://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html

8. *Scikit-learn.metrics.silhouette_score*. (n.d.). Scikit-learn. https://scikit-learn.org/stable/modules/generated/sklearn.metrics.silhouette_score.html

9. Sill, J., Takacs, G., Mackey, L., & Lin, D. (2009). Feature-weighted linear stacking. *arXiv preprint*. https://arxiv.org/abs/0911.0460

10. user2614596. (2017, February 3). Should I perform data centering before apply SVD? [Online forum comment]. *Stack Overflow*. https://stackoverflow.com/questions/42024705/should-i-perform-data-centering-before-apply-svd

11. Wolpert, D. H. (1992). Stacked generalization. *Neural Networks*, *5*(2), 241–259. https://doi.org/10.1016/S0893-6080(05)80023-1

12. Zhou, Z.-H. (2012). *Ensemble methods: Foundations and algorithms*. Chapman and Hall/CRC. https://doi.org/10.1201/b12207

<!-- MathJax (inline $...$, blocks $$...$$) -->
<script>
window.MathJax = {
  tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
  svg: { fontCache: 'global' }
};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>