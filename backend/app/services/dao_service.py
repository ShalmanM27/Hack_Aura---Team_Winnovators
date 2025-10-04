# app/services/dao_service.py
from app.services.web3_utils import get_contract, build_signed_tx, send_signed_transaction
from app import config

DAO_ADDRESS = config.DAO_ADDRESS
dao_contract = get_contract(DAO_ADDRESS, "DAO")

def create_proposal(description: str, duration: int):
    try:
        fn = dao_contract.functions.createProposal(description, duration)
        signed = build_signed_tx(fn)
        receipt = send_signed_transaction(signed)
        return dict(txHash=receipt.transactionHash.hex(), status=receipt.status)
    except Exception as e:
        raise

def vote(proposal_id: int, support: bool):
    try:
        fn = dao_contract.functions.vote(proposal_id, support)
        signed = build_signed_tx(fn)
        receipt = send_signed_transaction(signed)
        return dict(txHash=receipt.transactionHash.hex(), status=receipt.status)
    except Exception as e:
        raise

def execute_proposal(proposal_id: int):
    try:
        fn = dao_contract.functions.executeProposal(proposal_id)
        signed = build_signed_tx(fn)
        receipt = send_signed_transaction(signed)
        return dict(txHash=receipt.transactionHash.hex(), status=receipt.status)
    except Exception as e:
        raise

def get_proposal(proposal_id: int):
    try:
        p = dao_contract.functions.proposals(proposal_id).call()
        # p tuple -> (id, proposer, description, startTime, endTime, yesVotes, noVotes, executed)
        return {
            "id": p[0],
            "proposer": p[1],
            "description": p[2],
            "startTime": p[3],
            "endTime": p[4],
            "yesVotes": p[5],
            "noVotes": p[6],
            "executed": p[7]
        }
    except Exception as e:
        raise
