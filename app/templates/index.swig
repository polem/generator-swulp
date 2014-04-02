{% extends "layouts/_base.swig" %}

{% block content %}

<div class="container">
    <div class="header">
        <ul class="nav nav-pills pull-right">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
        <h3 class="text-muted">Swulp</h3>
    </div>

    <div class="jumbotron">
        <h1>'Allo, 'Allo!</h1>
        <p class="lead">Always a pleasure scaffolding your apps.</p>
        <p><a class="btn btn-lg btn-success" href="#">Splendid!</a></p>
    </div>

    <div class="row marketing">
        <div class="col-lg-6">
            {% for feature in features %}
            <h4>{{ feature.title}}</h4>
            <p>{{ feature.description }}</p>
            {% endfor %}
        </div>
    </div>

    <div class="footer">
        <p>♥ from the Yeoman team</p>
    </div>
</div>
{% endblock %}
