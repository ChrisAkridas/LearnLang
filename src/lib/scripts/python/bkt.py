import os
import platform
import sys
import json
import numpy as np
import pandas as pd
import pickle
from pyBKT.models import Model

# for Linux replace "\\" with "/"

my_path = os.path.dirname(__file__)
platform = platform.system()
divider = "\\" if platform == "Windows" else "/"

# def train_pybkt_model(): 
#     model = Model()
#     model.fit(data_path= my_path + divider + "trainingDataset.csv")

def save_model(model, file_path): 
    model.save(file_path)

def load_model(filePath):
    try: 
        if not os.path.exists(filePath):
            print(f"File {filePath} does not exist.")
            return None

        with open(filePath, 'rb') as file:
            model = pickle.load(file)
        
        print(f"Model successfully loaded from {filePath}")
        return model
       
    except Exception as e:
        print(f"Error loading pyBKT model: {e}")
        return None

def train_model():
    model = Model(num_fits=5)
    model.fit(data_path=my_path + divider + "trainingDataset.csv", parallel=True)
    save_model(model, my_path + divider + "model.pkl")
    return model

def run_bkt(model):
    predictions = model.predict(data_path = my_path + divider + 'data.csv')
    evaluations = model.evaluate(data_path = my_path + divider +'data.csv')
    return {"predictions": predictions, "evaluations": evaluations}

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    # skills = input_data.get('skills')
    print(f"Input data: {input_data}")
    
    model = load_model(my_path + divider + 'model.pkl')
    if model is None: 
       model = train_model()

    result = run_bkt(model)
    train_model()
    print(f"Model params", model.params())
    print(result)