using System;

public class InvalidImageTypeException : Exception
{
    public InvalidImageTypeException()
    {
    }

    public InvalidImageTypeException(string message)
        : base(message)
    {
    }

    public InvalidImageTypeException(string message, Exception inner)
        : base(message, inner)
    {
    }
}
