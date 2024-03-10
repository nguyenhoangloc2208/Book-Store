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

