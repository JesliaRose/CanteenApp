from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# PostgreSQL connection string
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://canteen_user:canteen123@localhost/canteen'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init DB
db = SQLAlchemy(app)

# Example model
class TestStudent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

# Add this below your TestStudent model
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    roll_number = db.Column(db.String(20), unique=True, nullable=False)


class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    available_quantity = db.Column(db.Integer, nullable=False)  # How many items available today

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('menu_item.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    student = db.relationship('Student', backref='orders')
    item = db.relationship('MenuItem', backref='orders')



# Home route
@app.route('/')
def home():
    return "Canteen App is running! 🚀"

# Add test data route
@app.route('/add')
def add_student():
    student = TestStudent(name="Lia")
    db.session.add(student)
    db.session.commit()
    return "Student added to DB!"

# Show students
@app.route('/students')
def get_students():
    students = TestStudent.query.all()
    return {'students': [s.name for s in students]}

@app.route('/register_student/<name>/<roll>')
def register_student(name, roll):
    student = Student(name=name, roll_number=roll)
    db.session.add(student)
    db.session.commit()
    return f"Student {name} added successfully!"

@app.route('/add_menu_item/<id>/<name>/<int:price>/<int:qty>')
def add_menu_item(id, name, price, qty):
    item = MenuItem(id=id, name=name, price=price, available_quantity=qty)
    db.session.add(item)
    db.session.commit()
    return f"Menu item '{name}' added!"

@app.route('/menu')
def get_menu():
    items = MenuItem.query.all()
    return {'menu': [{ 'name': i.name, 'price': i.price, 'qty': i.available_quantity } for i in items]}

""" @app.route('/order/<roll>/<int:item_id>/<int:qty>')
def place_order(roll, item_id, qty):
    # 1. Check student
    student = Student.query.filter_by(roll_number=roll).first()
    if not student:
        return {"error": "Student not found"}, 404

    # 2. Check item
    item = MenuItem.query.get(item_id)
    if not item:
        return {"error": "Item not found"}, 404

    # 3. Check stock
    if item.available_quantity < qty:
        return {"error": "Not enough quantity available"}, 400

    # 4. Create order
    order = Order(student_id=student.id, item_id=item.id, quantity=qty)
    item.available_quantity -= qty

    db.session.add(order)
    db.session.commit()

    return {"message": f"{student.name} ordered {qty}x {item.name}"} """

@app.route('/place_order', methods=['POST'])
def place_order():
    data = request.get_json()
    roll = data['roll']
    items = data['items']  # list of { item_id, qty }

    student = Student.query.filter_by(roll_number=roll).first()
    if not student:
        return {"error": "Student not found"}, 404

    for entry in items:
        item = MenuItem.query.get(entry['item_id'])
        if item is None:
            return {"error": f"Item ID {entry['item_id']} not found"}, 400
        if item.available_quantity < entry['qty']:
            return {"error": f"Not enough stock for {item.name}"}, 400

        item.available_quantity -= entry['qty']
        order = Order(student_id=student.id, menu_item_id=item.id, quantity=entry['qty'])
        db.session.add(order)

    db.session.commit()
    return {"message": "Order placed successfully!"}



@app.route('/orders_today')
def orders_today():
    results = db.session.query(
        MenuItem.name,
        db.func.sum(Order.quantity).label('total_ordered')
    ).join(Order.item).group_by(MenuItem.name).all()

    return {
        "orders": [
            {"item": name, "total_ordered": int(total)}
            for name, total in results
        ]
    }

@app.route('/stock_status')
def stock_status():
    items = MenuItem.query.all()
    return {
        "stock": [
            {
                "item": item.name,
                "available": item.available_quantity,
            }
            for item in items
        ]
    }

@app.route('/student_orders/<roll>')
def student_orders(roll):
    student = Student.query.filter_by(roll_number=roll).first()
    if not student:
        return {"error": "Student not found"}, 404

    orders = [
        {
            "item": order.item.name,
            "quantity": order.quantity
        }
        for order in student.orders
    ]
    return {"student": student.name, "orders": orders}



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("✅ Tables created!")

    app.run(debug=True)
