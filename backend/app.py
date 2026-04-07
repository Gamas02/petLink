from flask import Flask, jsonify, request, url_for, flash
from flask_cors import CORS
from db import conectar
from config import SECRET_KEY, FLASK_DEBUG
