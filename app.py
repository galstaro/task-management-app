# app.py
from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    due_date = db.Column(db.String(20), nullable=True)
    priority = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(20), nullable=True)
    created_date = db.Column(db.String(20), nullable=True)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    new_task = Task(
        name=data.get('name'),
        description=data.get('description'),
        due_date=data.get('due_date'),
        priority=data.get('priority'),
        status=data.get('status'),
        created_date=data.get('created_date')
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created!'}), 201

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.order_by(Task.due_date).all()  # Sorted by due_date
    tasks_list = [{
        'id': t.id,
        'name': t.name,
        'description': t.description,
        'due_date': t.due_date,
        'priority': t.priority,
        'status': t.status,
        'created_date': t.created_date
    } for t in tasks]
    return jsonify(tasks_list)

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'}), 200
    else:
        return jsonify({'message': 'Task not found'}), 404

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404

    data = request.json
    task.name = data.get('name', task.name)
    task.description = data.get('description', task.description)
    task.due_date = data.get('due_date', task.due_date)
    task.priority = data.get('priority', task.priority)
    task.status = data.get('status', task.status)
    
    db.session.commit()
    return jsonify({'message': 'Task updated successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
