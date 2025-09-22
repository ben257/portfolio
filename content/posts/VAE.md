---
title: "Variational Autoencoder"
date: 2025-06-22
draft: false
tags: ["Variational Autoencoder"]
math: true
---



### Background
While the autoencoder is mostly for compression rather than generation, the variational autoencoder is a generative version which allows probabilistic sampling of the latent space. Unlike the autoencoder, where each image is mapped to a point in the latent space, for the VAE, each image is mapped to a multivariate normal distribution in the latent space, centered around a point. The encoder maps the input to the mean and variance vector of this space. To actually sample a point from the latent space, the equation `z = z_mean + z_sigma*epsilon` is used where epsilon is a sample from the standard normal distribution.

While the autoencoder loss function consists of just the reconstruction loss, the variational autoencoder loss function contains an additional term: KL Divergence. The KL Divergence encourages the distribution of the latent space to follow a standard normal distribution. In the case of the VAE, the KL divergence is given by $\mathcal{L}_{KL} = -\tfrac{1}{2} \sum \big( 1 + \log \sigma^2 - \mu^2 - \sigma^2 \big)$. The contribution of the KL Divergence to the loss of the VAE is weighted by a factor $\beta$.

To generate new samples from the VAE, a point can be sampled from the standard multivariate normal distribution, and passed through the decoder.

### Results
I trained a VAE on the MNIST data set with $\beta=1$. Some observations are that the reconstruction loss is decreasing over the course of training; additionally, the reconstruction loss is an order of magnitude larger than the KL-Divergence loss, so that the training of the VAE will be dominated by the reconstruction loss.

<img src="/images/vae_loss.png" alt="alt text" height="400">
<br><br>

The the quality of the reconstructed images is similar to the autoencoder in the previous post.
<img src="/images/vae_reconstruction.png" alt="alt text">
<br>

However, the latent space follows a normal distribution much more closely than in the case of the autoencoder.

<img src="/images/vae_latent_space_train.png" alt="alt text" height="300">
<img src="/images/vae_latent_space.png" alt="alt text" height="300">
<br><br>

However, when I increase the importance of the KL-Divergence loss by setting $\beta=30$, there is posterior collapse, with the KL-Divergence term dominating the loss. The latent distribution more closely follows a normal distribution than before. However, there is near zero variance, and the generated images are very poor. This $\beta$ reduces the information capacity of the latent space and is too large.

<img src="/images/vae_collapse.png" alt="alt text" height="300">
<img src="/images/vae_collapse_grid.png" alt="alt text" height="300">
<br>

<script>
window.MathJax = {
  tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
  svg: { fontCache: 'global' }
};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>