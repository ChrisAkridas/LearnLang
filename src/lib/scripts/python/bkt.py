import os
import sys
import json
import numpy as np
import pandas as pd
from pyBKT.models import Model

my_path = os.path.dirname(__file__)

# def run_bkt(skills):
#     model = Model()
#     model.fit(data_path="../../training.csv")  # Replace with actual dataset
#     predictions = model.predict(data_path="example_test.csv", skills=skills)
#     return predictions.tolist()

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    skills = input_data.get('skills')
  
    # print(my_path + '\\training.csv')
  
    model = Model()
    model.fit(data_path = my_path + '\\training.csv')  # Replace with actual dataset
    # print(model.params())
    # predictions = model.predict(data_path="example_test.csv", skills=skills)
    # return predictions.tolist()
    # print(json.dumps({"predictions": predictions.tolist()}))

    # df = pd.read_csv("../../data_sets/training.csv")  # Replace with actual dataset
    # result = run_bkt(skills)
    # print(json.dumps({"predictions": result}))