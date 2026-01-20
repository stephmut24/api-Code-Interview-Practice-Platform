import sys
import threading

def solve():
    code = sys.stdin.read()

    # Séparer code / input
    separator = "###INPUT###"
    user_code, test_input = code.split(separator)

    namespace = {}

    exec(user_code, namespace)

    if "solve" not in namespace:
        print("Error: solve() not defined")
        return

    sys.stdin = sys.__stdin__
    print(run_with_input(namespace["solve"], test_input))


def run_with_input(fn, data):
    import io
    backup = sys.stdin
    sys.stdin = io.StringIO(data)
    try:
        return fn()
    finally:
        sys.stdin = backup


solve()
