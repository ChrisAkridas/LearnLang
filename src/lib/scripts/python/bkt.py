import os
import sys
import json
import numpy as np
import pandas as pd
from pyBKT.models import Model

my_path = os.path.dirname(__file__)

def train_pybkt_model(): 
    model = Model()
    model.fit(data_path= my_path + "\\trainingDataset.csv")

def save_model(model, file_path): 
    model.save(file_path)

def load_model(file_path):
    return Model.load(file_path)

def run_bkt(skills):
    model = Model()
    model.fit(data_path = my_path + '\\trainingDataset.csv', skills=skills)  # Replace with actual dataset
    predictions = model.predict(data_path = my_path + '\\trainingDataset.csv')
    evaluations = model.evaluate(data_path = my_path + '\\trainingDataset.csv')
    return {"predictions": predictions, "evaluations": evaluations}

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    skills = input_data.get('skills')
    
    result = run_bkt(skills)
    print(result)