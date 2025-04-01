from setuptools import setup


def read_requirements():
    with open('requirements.txt', encoding='utf-8') as f:
        return [
            line.strip()
            for line in f
            if line.strip() and not line.startswith('#')
        ]


setup(
    name='minimalist-miniflux-headline-viewer',
    packages=[
        'mmhv',
    ],
    package_data={
        'mmhv': [
            'static/*.js',
            'static/*.css',
            'templates/*.html',
        ],
    },
    version='0.1.1',
    install_requires=read_requirements(),
    entry_points={
        'console_scripts': [
            'mmhv = mmhv:cli',
        ],
    },
)
