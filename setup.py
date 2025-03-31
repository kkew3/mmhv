from setuptools import setup


def read_requirements():
    with open('requirements.txt', encoding='utf-8') as f:
        return [
            line.strip()
            for line in f
            if line.strip() and not line.startswith('#')
        ]


setup(
    name='quick-read-miniflux-headline',
    py_modules=[
        'app',
    ],
    version='0.1.0',
    install_requires=read_requirements(),
)
