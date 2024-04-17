import os
import unidecode

def custom_slugify(slug):
    slug = slug.replace(" ", "-")
    slug = slug.replace(",", "-")
    slug = slug.replace("(", "-")
    slug = slug.replace(")", "")
    slug = slug.replace("؟", "")
    slug = slug.lower()
    slug = unidecode.unidecode(slug)
    return slug

def category_image_path(instance, filename):
    name, extension = os.path.splitext(filename)
    return f"products/category/{custom_slugify(instance.name)}/{custom_slugify(instance.name)}{extension}"

def product_image_path(instance, filename):
    return f"products/images/{custom_slugify(instance.name)}/{filename}"

def author_image_path(instance, filename):
    return f"products/author/{custom_slugify(instance.name)}/{filename}"

def blogs_image_path(instance, filename):
    cleaned_title = ''.join(c for c in instance.post.title if c.isalnum() or c in ['-', '_', ' '])
    shortened_title = cleaned_title[:50]
    return f"blogs/{custom_slugify(shortened_title)}/{filename}"

def blogs_post_image_path(instance, filename):
    cleaned_title = ''.join(c for c in instance.title if c.isalnum() or c in ['-', '_', ' '])
    shortened_title = cleaned_title[:50]
    return f"blogs/{custom_slugify(shortened_title)}/{filename}"
