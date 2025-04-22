import os
import platform
import sys
import json
import numpy as np
import pandas as pd
from pyBKT.models import Model

# for Linux replace "\\" with "/"

my_path = os.path.dirname(__file__)
platform = platform.system()
divider = "\\" if platform == "Windows" else "/"

def train_pybkt_model(): 
    model = Model()
    model.fit(data_path= my_path + divider + "trainingDataset.csv")

def save_model(model, file_path): 
    model.save(file_path)

def load_model(file_path):
    return Model.load(file_path)

def train_model():
    model = Model()
    model.fit(data_path=my_path + divider + "trainingDataset.csv")
    return model

def run_bkt():
    model = Model()
    
    model.fit(data_path = my_path + divider + 'trainingDataset.csv',)  # Replace with actual dataset
    save_model(model, my_path + divider + 'model.pkl')
    predictions = model.predict(data_path = my_path + divider + 'chrisData.csv')
    evaluations = model.evaluate(data_path = my_path + divider +'chrisData.csv')
    return {"predictions": predictions, "evaluations": evaluations}

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    # skills = input_data.get('skills')
    
    result = run_bkt()
    print(result)