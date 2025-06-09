import os
import platform
import sys
import json
import pickle
import pandas as pd
import numpy as np
from pyBKT.models import Model


my_path = os.path.dirname(__file__)
platform = platform.system()
divider = "\\" if platform == "Windows" else "/"

def save_model(model, file_path): 
    model.save(file_path)

def load_model(filePath):
    try: 
        if not os.path.exists(filePath):
            # print(f"File {filePath} does not exist.")
            return None
        with open(filePath, 'rb') as file:
            model = pickle.load(file)
        # print(f"Model successfully loaded from {filePath}")
        return model    
    except Exception as e:
        # print(f"Error loading pyBKT model: {e}")
        return None

def train_model(model_param=None, hasPrior=False):
    model_to_train = model_param
    
    if model_to_train is None:
        model_to_train = Model(num_fits=5)

    if(hasPrior):
        model_to_train.fit(data_path=my_path + divider + "trainingDataset.csv", parallel=True, fixed=hasPrior)
    else: 
        model_to_train.fit(data_path=my_path + divider + "trainingDataset.csv", parallel=True)

    save_model(model_to_train, my_path + divider + "model.pkl")
    return model_to_train

def run_bkt(model,fileName):
    predictions = model.predict(data_path = my_path + divider + fileName + ".csv")
    # evaluations = model.evaluate(data_path = my_path + divider + fileName + ".csv")
    return predictions

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    fileName = input_data.get('filename')
    prior = input_data.get('prior') if input_data.get('prior') is not None else None
    
    model = load_model(my_path + divider + 'model.pkl')
    if model is None:
        model = train_model()
    

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~``
    # # Update the model's prior parameter if prior is provided
    hasPrior = prior is not None
    if hasPrior:
        paramsDf = model.params()
        params_dict = paramsDf.to_dict(orient='dict')
        params_dict['value'][('vocabulary', 'prior', 'default')] = prior

        raw_dict = params_dict['value']
        converted = {}

        for (skill, param, cls), value in raw_dict.items():
            if skill not in converted:
                converted[skill] = {}

            if param == 'prior':
                converted[skill][param] = prior
            else:
                converted[skill][param] = np.array([value])
                # print(params_dict)

        # print(converted)
        model.coef_ = converted
    
    # print(model.params())
    train_model(model, hasPrior)
    predictions = run_bkt(model, fileName)
    predictions = predictions['state_predictions'].tolist()
    evaluations = model.evaluate(data_path = my_path + divider + fileName + ".csv")
    print(json.dumps({"predictions": predictions, "initial_prior": prior, "evaluations": evaluations}))