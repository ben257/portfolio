---
title: "Structural Break Detection Competition"
date: 2025-06-22
draft: false
tags: ["recsys", "SVD", "stacking", "collaborative filtering"]
math: true
---

# Data Set Overview
The data set was from the [Structural Break Competition](https://hub.crunchdao.com/competitions/structural-break) from CrunchDao. The goal of the competition was to identify if a structural break occured in a univariate time series. A structural break is defined as whether a distribution shift occurs after a given boundary point.

For example, the figure below has a structural break in 1998 and 2008.
    <br>
    <img src="/images/structural_break_example.png" alt="alt text" width="400">


The training set contained 10k time series. Each series was labeled with whether a structural break occured, and the index of the potential structural break was identified. The competition metric was ROC AUC (Area Under the Receiver Operating Characteristic Curve).

# Feature Engineering
A challenge of this data set was that the data was not in tabular format used by traditional machine learning models. Therefore, we needed to engineer features to aggregate the time series into tabular format.

Engineered features focused on comparing each series pre vs. post breakpoint to capture changes in distribution. Example engineered features included       
* Two-sample t-test (test difference in means)  
* Kolmogorov–Smirnov test (nonparametric test of difference in distributions)  
* Mood’s two-sample test (nonparametric test of difference in spread)  
* Absolute difference in sample means  
* Interquartile range change

# Model 1 (XGBoost)
These features were first inputted to a classical machine learning model: XGBoost. Optuna was used for hyperparameter tuning. 
Tuned parameters included
* max_depth (depth of tree)
* reg_lambda (L1 regularization to shrink leaf weights to 0)
* reg_alpha (L2 regularization to shrink leaf weights toward 0)
* subsample (fraction of training rows sampled for each tree)
* min_child_weight (minimum sum of instances in child node)
* gamma (minimum loss reduction for split)
* colsample_bytree (fraction of features sampled for each
tree)
* n_estimators (number of trees)

# Model 2 (Neural Network)
The above engineered features were missing key information present in the original sequences, since they were just aggregations. A multibranch recurrent neural network architecture was therefore tried. This architecture had three input branches: the sequence preceding the potential break; the sequence following the potential break; and the previously engineered statistical features. These branches would then be combined and passed to a final dense layer with sigmoid activation function for classification. This deep learning model had a 1% boost in accuracy compared to the XGBoost model.
<br>
    <img src="/images/model_architecture.png" alt="alt text" width="700">

### References

1. Bai, J., & Perron, P. (1998). Estimating and testing linear models with multiple structural changes. Econometrica, 66(1), 47-78. https://www.jstor.org/stable/2998540
2. Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, 785-794. https://dl.acm.org/doi/10.1145/2939672.2939785
3. Géron, A. (2019). Hands-on machine learning with Scikit-Learn, Keras, and TensorFlow: Concepts, tools, and techniques to build intelligent systems (2nd ed.). O'Reilly Media.
4. Hunter, J. D. (2007). Matplotlib: A 2D graphics environment. Computing in Science & Engineering, 9(3), 90-95. https://ieeexplore.ieee.org/document/4160265
5. Ke, G., Meng, Q., Finley, T., Wang, T., Chen, W., Ma, W., Ye, Q., & Liu, T. Y. (2017). LightGBM: A highly efficient gradient boosting decision tree. Advances in Neural Information Processing Systems, 30, 3146-3154. https://proceedings.neurips.cc/paper/2017/hash/6449f44a102fde848669bdd9eb6b76fa-Abstract.html
6. Killick, R., Fearnhead, P., & Eckley, I. A. (2012). Optimal detection of changepoints with a linear computational cost. Journal of the American Statistical Association, 107(500), 1590-1598. https://www.tandfonline.com/doi/abs/10.1080/01621459.2011.587287
7. McKinney, W. (2010). Data structures for statistical computing in Python. Proceedings of the 9th Python in Science Conference, 56-61. https://conference.scipy.org/proceedings/scipy2010/pdfs/mckinney.pdf
8. OpenAI. (2025). GPT-5 [Large language model]. OpenAI. https://openai.com/
9. Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., Blondel, M., Prettenhofer, P., Weiss, R., Dubourg, V., Vanderplas, J., Passos, A., Cournapeau, D., Brucher, M., Perrot, M., & Duchesnay, E. (2011). Scikit-learn: Machine learning in Python. Journal of Machine Learning Research, 12, 2825-2830. http://www.jmlr.org/papers/v12/pedregosa11a.html
10. Truong, C., Oudre, L., & Vayatis, N. (2018). ruptures: Change point detection in Python [Computer software]. GitHub. https://github.com/deepcharles/ruptures
11. Truong, C., Oudre, L., & Vayatis, N. (2020). Selective review of offline change point detection methods. Signal Processing, 167, 107299. https://www.sciencedirect.com/science/article/pii/S0165168419303042
12. Virtanen, P., Gommers, R., Oliphant, T. E., Haberland, M., Reddy, T., Cournapeau, D., Burovski, E., Peterson, P., Weckesser, W., Bright, J., van der Walt, S. J., Brett, M., Wilson, J., Millman, K. J., Mayorov, N., Nelson, A. R. J., Jones, E., Kern, R., Larson, E., ... SciPy 1.0 Contributors. (2020). SciPy 1.0: Fundamental algorithms for scientific computing in Python. Nature Methods, 17(3), 261-272. https://www.nature.com/articles/s41592-019-0686-2

<!-- MathJax (inline $...$, blocks $$...$$) -->
<script>
window.MathJax = {
  tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
  svg: { fontCache: 'global' }
};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
